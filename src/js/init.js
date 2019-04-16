export default async function () {
  const body = await $fetch.get('user').catch(error => {
    if (error.code === 105) location.href = `/login.html?next=${location.href}`
  })
  if (body === undefined) throw 'No Session'

  return body
}
