module.exports = {
  calculateBox(boundingBox, imgWidth, imgHeight) {
    ; // TODO: improve getting the width of the image ...

    const leftStart = boundingBox.left_col * imgWidth;
    console.log('leftStart: ', leftStart);
    // calculate left start from containing img

    // calculate top start from containing img
    const topStart = boundingBox.top_row * imgHeight;
    console.log('topStart: ', topStart);
      // same thing for left stop
        // calculate width of bounding box as leftStop - leftStart
        const leftStop = boundingBox.right_col * imgWidth;
        console.log('leftStop: ', leftStop);
      // same thing for top stop
        // calculate height of bounding box as topStop - topStart
        const topStop = boundingBox.bottom_row * imgHeight;
        console.log('topStop: ', topStop);

    return {
      leftStart,
      leftStop,
      topStart,
      topStop
    }
  }
}