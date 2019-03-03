/*
 * grunt-cf-compiler
 * https://github.com/eklingen88/grunt-cf-compiler
 *
 * Copyright (c) 2019 Eric M. Klingensmith
 * Licensed under the MIT license.
 */

'use strict';

const YAML = require('yaml');
const cfnParser = require('cfn-lint/lib/parser');
const path = require('path');
// const tsNode = require('ts-node' );
// const tsp = require('typescript-parser' );
// const tsParser = new tsp.TypescriptParser;

// const cloudform = require('cloudform');
// const tsNode = require('ts-node').register({ project: process.cwd()+ "/tsconfig.json" });

// const ts = require('typescript');
// const tsconfig = require('tsconfig');

// const compilerOptions = tsconfig.loadSync(process.cwd()).config.compilerOptions

// const { exec } = require( 'child_process' );
// const vm = require( 'vm' );
// const newModule = require( 'module' );
// const Execute = require('execute-js');


module.exports = function (grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    let processTemplate = function(filepath, parent) {
        // Parse the template
        let templateNodes = parseTemplate(filepath);

        // Get the important nodes
        let resourceNodes = getResourceNodes(templateNodes);

        // Find nested stacks
        for ( let resourceProperty in resourceNodes) {
            let resourceNode = resourceNodes[resourceProperty];

            if( resourceNode.Type == 'AWS::CloudFormation::Stack' ) {
                let nestedFilepath = resourceNode.Properties.TemplateURL;
                nestedFilepath = path.resolve(path.dirname(filepath), nestedFilepath);

                let nestedTemplateNodes = processTemplate( nestedFilepath );
                let nestedResourceNodes = getResourceNodes(nestedTemplateNodes);

                // Remove this node
                delete resourceNodes[resourceProperty];

                // Add the nested resources
                for( let nestedResourceProperty in nestedResourceNodes ) {
                    resourceNodes[nestedResourceProperty] = nestedResourceNodes[nestedResourceProperty];
                }
            }
        }

        // Send back the processed nodes
        return templateNodes;
    }

    let parseTemplate = function (filepath) {
        // Make sure file exists
        if (!grunt.file.exists(filepath)) {
            grunt.log.warn('Source file"' + filepath + '" not found.');
        }

        // Use cfn-lint's parser
        return cfnParser.openFile(filepath);
    }

    let getResourceNodes = function(templateNodes) {
        // Make sure resources property exists
        if(templateNodes.hasOwnProperty('Resources' ) ) {
            return templateNodes.Resources;
        }
    }

    grunt.registerMultiTask('cf_compiler', 'Compiler for AWS CloudFormation', function () {
        // Merge task-specific and/or target-specific options with these defaults.
        let options = this.options({
            outputFormat: 'yaml'
        });

        // Iterate over all specified file groups.
        this.files.forEach(function (f) {
            // Get absolute filepath
            let filepath = f.src[0];
            filepath = path.resolve( process.cwd(), filepath );

            // Parse the template
            let processedTemplateNodes = processTemplate(filepath);

            // Put back into output format
            let output = YAML.stringify(processedTemplateNodes);

            // Write the destination file.
            grunt.file.write(f.dest, output);

            // Print a success message.
            grunt.log.writeln('File "' + f.dest + '" created.');
        });
    });

};
