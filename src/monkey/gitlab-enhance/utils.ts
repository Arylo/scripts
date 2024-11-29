export const getButtonElement = (text: string) => {
  const classnames = 'gl-font-sm! gl-ml-3 gl-button btn btn-default btn-sm'
  return $(`<a class="${classnames}">${text}</a>`)
}
