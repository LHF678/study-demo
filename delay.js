function delay (duration) {
    var start = Date.now();
    while (Date.now() - start < duration) {}
}