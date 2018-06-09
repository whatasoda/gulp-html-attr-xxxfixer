import Stream       = require('stream')
import through      = require('through2')
import cheerio      = require('cheerio')
import Vinyl        = require('vinyl')
import PluginError  = require('plugin-error')

const PLUGIN_NAME = 'gulp-html-attr-xxxfixer'

export = HTMLAttrXXXfixer
function HTMLAttrXXXfixer (
  rules: HTMLAttrXXXfixer.Rule[]
): Stream.Transform {
  const _rules = rules.map(rule => {
    const name    = rule.attrName
    const prefix  = rule.prefix || ''
    const suffix  = rule.suffix || ''
    const filter: HTMLAttrXXXfixer.Filter = value => (
      (rule.pattern ? rule.pattern.test(value) : true) &&
      (rule.filter  ? rule.filter(value)       : true)
    )
    return { name, prefix, suffix, filter }
  })

  return through.obj(function (file: Vinyl, encoding, callback) {
    if (file.isNull()) return callback(null, file);

    if (file.isStream())
      return this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported!'));

    if (!file.isBuffer())
      return this.emit('error', new PluginError(PLUGIN_NAME, 'Unsupported file type!'));

    const $ = cheerio.load(file.contents.toString('utf-8'), { decodeEntities: false })
    _rules.forEach( ({ name, prefix, suffix, filter }) =>
      $(`[${name}]`).each((index, elem) => {
        const $elem = $(elem)
        const value = $elem.attr(name)
        if (!(value && filter(value))) return;
        $elem.attr(name, prefix + value + suffix)
      })
    )

    file.contents = new Buffer($.html())

    callback(null, file)
  })
}

HTMLAttrXXXfixer.prefix = (prefix: string, attrNames: string[]) =>
  attrNames.map(name => ({ attrName: name, prefix }))

HTMLAttrXXXfixer.suffix = (suffix: string, attrNames: string[]) =>
  attrNames.map(name => ({ attrName: name, suffix }))

namespace HTMLAttrXXXfixer {
  export declare function prefix (prefix: string, attrNames: string[]): Rule[]
  export declare function suffix (prefix: string, attrNames: string[]): Rule[]
  export interface Rule {
    attrName  : string

    prefix?   : string
    suffix?   : string

    pattern?  : RegExp
    filter?   : Filter
  }
  export type Filter = (value: string) => boolean
}
