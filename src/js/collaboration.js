import {getSearchParam} from 'lovue/dist/utils.esm'

const slug = getSearchParam('slug')

if (slug === undefined || slug === null) {
  document.write('文档不存在')
} else {
  const iframe = document.createElement('iframe')
  iframe.src = `https://codimd.mycapital.net/${slug}`
  document.body.appendChild(iframe)
}


