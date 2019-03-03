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
            // Get all of the resource nodes
            let resourceNode = resourceNodes[resourceProperty];

            // Check if it's a nested stack
            if( resourceNode.Type == 'AWS::CloudFormation::Stack' ) {
                // Parse the nested stack
                let nestedFilepath = resourceNode.Properties.TemplateURL;
                nestedFilepath = path.resolve(path.dirname(filepath), nestedFilepath);

                let nestedTemplateNodes = processTemplate( nestedFilepath );
                let nestedResourceNodes = getResourceNodes(nestedTemplateNodes);

                // Remove this node
                delete resourceNodes[resourceProperty];

                // Add the nested resources
                for( let nestedResourceProperty in nestedResourceNodes ) {
                    // Make sure that there isn't a conflict
                    if(resourceNodes.hasOwnProperty(nestedResourceProperty)) {
                        grunt.log.error('Conflicting resources in nested template.' );
                    } else {
                        // Add the nested resource
                        resourceNodes[nestedResourceProperty] = nestedResourceNodes[nestedResourceProperty];
                    }
                }
            }
        }

        // Strip metadata out
        templateNodes = stripMetadata(templateNodes);

        // Send back the processed nodes
        return templateNodes;
    }

    let stripMetadata = function(nodes) {
        // Loop through all of the nodes
        for( let property in nodes) {
            // Check if it's a metadata node
            if (property == 'Metadata' ) {
                // Delete it
                delete nodes[property];
            } else {
                // Go deeper if it's an object
                let node = nodes[property];

                if( typeof node == 'object' ) {
                    stripMetadata(node);
                }
            }
        }

        return nodes;
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
