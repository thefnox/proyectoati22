module.exports = function(grunt) {
  grunt.config.set('bower', {
    dev: {
        dest: '.tmp/public',
        js_dest: '.tmp/public/js',
        css_dest: '.tmp/public/styles',
        options: {
	      	packageSpecific: {
		        angular: {
			        files:[
			        	"angular.js",
			        	"angular-csp.css"
			        ]
		        },
		        "angular-bootstrap": {
		        	files:[
		        		"index.js",
		        		"ui-bootstrap-tpls.js",
		       			"ui-bootstrap-csp.css"
		        	]
		        }
	     	}
    	}
    }
  });

  grunt.loadNpmTasks('grunt-bower');

};