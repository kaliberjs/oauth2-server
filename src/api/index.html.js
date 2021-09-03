// // @ts-ignore
// // eslint-disable-next-line no-undef
const config = __non_webpack_require__('@kaliber/config')

Index.routes = {
  match: async (location, req) => {
    return config.server.api.handler(location, req)
  }
}

export default function Index({ data }) {
  if (data.body) return data.body
  //TODO: FIX in @kaliber / build, this is a workaround (this is now a module, most likely because we import React behind the screens)
  return null
}
