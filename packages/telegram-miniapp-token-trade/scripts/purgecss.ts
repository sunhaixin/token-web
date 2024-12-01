// import PurgeCSS from "purgecss";

// const purgeCSSResults = await new PurgeCSS().purge({
//   content: ['**/*.html', '**/*.js', '**/*.vue'],
//   defaultExtractor(content) {
//     const contentWithoutStyleBlocks = content.replace(/<style[^]+?<\/style>/gi, '')
//     return contentWithoutStyleBlocks.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g) || []
//   },
//   safelist: [
//     /-(leave|enter|appear)(|-(to|from|active))$/,
//     /^(?!(|.*?:)cursor-move).+-move$/,
//     /^router-link(|-exact)-active$/,
//     /data-v-.*/,
//   ],
// });
