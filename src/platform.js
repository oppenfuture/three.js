let platform = {
  updateplatform(params){
    this.window = params.window;
    this.document = params.document;
    this.XMLHttpRequest = params.XMLHttpRequest;
    this.atob = params.atob
  }
}

if(window && window.window) {
  platform = window
}

export { 
  platform
}
