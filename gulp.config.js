module.exports = function () {

    var config = {
        allTs: './src/**/!(*.d).ts',
        allCSS: './src/**/*.css',
        allFonts: './src/app/assets/fonts/**/*',
        allImages: './src/app/assets/images/**/*',
        allSCSS: './src/**/*.scss',
        allHTML: './src/**/*.html',
        allLang: './src/app/assets/lang/**/*',
        customLintRules : './lintRules/**/*Rule.ts',
        tslint: './tslint-rules.json',
        tsOutputPath: './dist/',
        fontsOutputPath: './dist/app/assets/fonts/',
        imagesOutputPath: './dist/app/assets/images/',
        langOutputPath: './dist/app/assets/lang/',
        excluded: '!./src/system-config.ts'
    };

    return config;
};
