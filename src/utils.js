module.exports = {
  calculateBox(boundingBox, imgWidth, imgHeight) {
    let result = {};
    let leftStart, topStart, leftStop, topStop;
    if (imgHeight && imgWidth && JSON.stringify(boundingBox) !== JSON.stringify({})) {
      leftStart = boundingBox.left_col * imgWidth;
      topStart = boundingBox.top_row * imgHeight;
      leftStop = boundingBox.right_col * imgWidth;
      topStop = boundingBox.bottom_row * imgHeight;

      result = {
        leftStart,
        leftStop,
        topStart,
        topStop
      }
    }
    return result;
  }
}