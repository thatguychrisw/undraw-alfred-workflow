'use strict'
const alfy = require('alfy')
const {Promise} = require('bluebird')
const {downloadSvg, illustrationPath, convertSvgToPng} = require('./src/helpers')

const processIllustrations = async (illustrations) => {
    /** @var element.slug The short name given by Undraw **/
    return Promise.map(illustrations, async (element) => {
        return new Promise(async (resolve) => {
            const svgPath = illustrationPath(`${element.slug}.svg`)
            const pngPath = illustrationPath(`${element.slug}.png`)

            await downloadSvg(element.image, svgPath)

            await convertSvgToPng(svgPath, pngPath)

            return resolve(element.slug)
        })
    }, {concurrency: 30})
}

(async () => {
    const input = (alfy.input.length <= 2) ? '' : alfy.input

    /** @var data.illustrations A collection of illustrations containing svg paths **/
    const data = await alfy.fetch('https://undraw.co/api/search', {
        method: 'POST',
        body: {
            query: input
        }
    })

    let cachedIllustrations = alfy.cache.get('illustrations') || []

    const uncachedIllustrations = data.illustrations.filter(element => !cachedIllustrations.includes(element.slug))
    const processedIllustrations = await processIllustrations(uncachedIllustrations)

    alfy.cache.set('illustrations', processedIllustrations)

    const items = data.illustrations.map(element => ({
        title: element.title,
        icon: {
            'path': illustrationPath(`${element.slug}.png`)
        },
        quicklookurl: 'file:///' + illustrationPath(`${element.slug}.png`),
        arg: element.image
    }))

    alfy.output(items)
})()
