# Browse


<script>

class Gallery {

  constructor() {
    this.apiBase = `https://lively-kernel.org/bp2021dev`    
  }

  async loadAlbums() {
       this.albums = await fetch('https://lively-kernel.org/bp2021dev/albums/', {
        headers: {
          authorization: "Bearer " +  localStorage["bp2021jwt"] ,
        }
      }).then(r => r.json())
    this.result.textContent = JSON.stringify(this.albums,undefined,  2)    
  }
  
  async browseAlbums() {
     if (!this.albums) await this.loadAlbums()
   
      this.result.innerHTML = ""
      var album = this.albums[0]
      for(let ea of album.pictures) {
        this.result.appendChild(<img src={this.apiBase + ea.Picture.media.formats.thumbnail.url}></img>)
      }    
   }
  
  async login() {
    let username = localStorage["bp2021username"] || "user@foo"
    username = await lively.prompt("username", username)

    localStorage["bp2021username"] = username

    var password = await lively.prompt("password", "", custom => {
      custom.get("#prompt").setAttribute("type", "password")
    })

    var resp = await fetch(apiBase + '/auth/local', {
        method: "POST",
        headers: {
          "content-type":  "application/json"
        },
        body: JSON.stringify({
          identifier: username,
          password: password,
        })
      })

    if (resp.status == 200) {
      loginButton.style.background = "green"
    } else {
      loginButton.style.background = "red" 
    }
    var loginData = await resp.json()
    this.result.textContent = JSON.stringify(loginData, undefined, 2)
    localStorage["bp2021jwt"] = loginData.jwt 
  }

  async logout() {
      delete localStorage["bp2021jwt"] 
      lively.notify("logged out")
      this.result.textContent = ""
      this.loginButton.style.background = "" 
  }
 
  createUI(ctx) {  
    this.loginButton = <button click={() => this.login()}>login</button>
    this.logoutButton = <button click={() => this.logout()}>logout</button>
 
    this.result = document.createElement("pre");

    var albumsButton = <button click={async () => {
      this.loadAlbums()
    }}>albums</button>

    var browseButton = <button click={async () => {
      this.browseAlbums()

    }}>browse</button>

    var pane = <div>{this.loginButton}{this.logoutButton}{albumsButton}{browseButton}{this.result}</div>;
     
    this.browseAlbums()
   
    return pane  
  }
}
new Gallery().createUI(this)
</script>




