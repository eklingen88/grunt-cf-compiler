# grunt-cf-compiler

> Compiler for AWS CloudFormation

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-cf-compiler --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-cf-compiler');
```

## The "cf_compiler" task

### Overview
In your project's Gruntfile, add a section named `cf_compiler` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  cf_compiler: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.outputFormat
Type: `String`
Default value: `'yaml'`

A string value to select the output format.  JSON not yet implemented.

### Usage Examples

#### Default Options
In this example, _testing.yaml_ will be parsed and any nested stacks will be placed directly in the template.  The output template will be in the YAML format.

```js
grunt.initConfig({
  cf_compiler: {
    options: {},
    files: [{
      src: 'src/testing.yaml',
      dest: 'dest/testing.yaml'
    }],
  },
});
```

#### Custom Options
Options not yet implemented.

```js
grunt.initConfig({
  cf_compiler: {
    options: {
      outputFormat: 'yaml'
    },
    files: [{
      src: 'src/testing.yaml',
      dest: 'dest/testing.yaml'
    }],
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Roadmap
- Additional testing of parameters.
- Merging stack input parameters ~~and outputs~~.
- Prefixing substack resource names.
- JSON and YAML output options.
- Template validation using _cfn-lint_.

## Release History
_(Nothing yet)_
