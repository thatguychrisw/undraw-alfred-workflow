const sharp = require('sharp')
const download = require('image-downloader')
const fs = require('fs')

const downloadSvg = async (url, path) => {
    let exists = fs.existsSync(path)

    if (!exists) {
        exists = await download.image({
            url,
            dest: path
        })
    }

    return !!exists
}

const convertSvgToPng = async (svg, png) => {
    let exists = fs.existsSync(png)

    if (!exists) {
        exists = await sharp(svg).png().toFile(png)
    }

    return !!exists
}

const illustrationPath = (path) => {
    return `${__dirname}/../illustrations/${path}`
}

module.exports = {downloadSvg, convertSvgToPng, illustrationPath}
