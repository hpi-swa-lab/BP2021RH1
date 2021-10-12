# Browse


<script>

class Gallery {

  constructor() {
    this.apiBase = `http://bp.bad-harzburg-stiftung.de` // https://lively-kernel.org/bp2021dev
  }

  async loadAlbums() {
       this.albums = await fetch(this.apiBase + '/albums/', {
        headers: {
          authorization: "Bearer " +  localStorage["bp2021jwt"] ,
        }
      }).then(r => r.json())
    this.log.textContent = JSON.stringify(this.albums,undefined,  2)    
  }
  
  async selectPicture(picture, element, evt) {
    if (evt.shiftKey) {
      lively.openInspector(picture)
      return 
    }
  
    this.gallery.querySelectorAll(".picture").forEach(ea => ea.classList.remove("selected"))
    element.classList.add("selected")
    this.selected = picture
    this.showDetails(picture, element)
  }
  
  showDetails(picture, element) {
    this.details.querySelector("#title").value = picture.title
    this.details.querySelector("#description").value = picture.description
    let comments = this.details.querySelector("#comments")
    comments.innerHTML = ""
    for(ea of picture.comments) {
      let comment  = <div>{JSON.stringify(ea)}</div>
     comments.appendChild(comment)
    } 
    
    let input = <input value="new comment" keydown={evt => {
      if (evt.keyCode === 13) this.addComment(picture, input.value)
    }}></input>
    comments.appendChild(input)
  }
  
  async api(method=GET, path="/", data={}) {
   let resp = await fetch(  this.apiBase + path, {
        method: method,
        headers: {
          authorization: "Bearer " +  localStorage["bp2021jwt"] ,
          "content-type":  "application/json"
        },
        body: JSON.stringify(data)
    })
    return resp.json()
  }
  
  
  addComment(picture, string) {
    lively.notify("add comment not implemented", string)
    // this.api("/")
   
  }
  
  async browseAlbums() {
     if (!this.albums) await this.loadAlbums()
   
      this.log.innerHTML = ""
      this.gallery.innerHTML = ""
      var album = this.albums[0]
      for(let ea of album.pictures) {
        let element = 
          <div class="picture">
            <img 
              click={evt => 
                this.selectPicture(ea, element, evt)} 
              src={this.apiBase + ea.media.formats.thumbnail.url}>
            </img>
          </div>
        this.gallery.appendChild(element)
      }    
   }
  
  async login() {
    let username = localStorage["bp2021username"] || "user@foo"
    username = await lively.prompt("username", username)

    localStorage["bp2021username"] = username

    var password = await lively.prompt("password", "", custom => {
      custom.get("#prompt").setAttribute("type", "password")
    })

    var resp = await fetch(this.apiBase + '/auth/local', {
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
      this.loginButton.style.background = "green"
    } else {
      this.loginButton.style.background = "red" 
    }
    var loginData = await resp.json()
    this.log.textContent = JSON.stringify(loginData, undefined, 2)
    localStorage["bp2021jwt"] = loginData.jwt 
  }

  async logout() {
      delete localStorage["bp2021jwt"] 
      lively.notify("logged out")
      this.log.textContent = ""
      this.loginButton.style.background = "" 
  }
 
  async updateTitle() {
    var picture = this.selected
    var title = this.details.querySelector("#title").value
    lively.notify("update picture " + picture.id +" title: " + title)
    var result = await this.api("PUT", "/pictures/" + picture.id, {
      id: picture.id,
      title: title
    })
    
    lively.notify("result", JSON.stringify(result))
    
    // refresh data... we could actually use "result" instead
    // this.loadAlbums()
    
    picture.title = result.title // take the data from server?
    
  }
 
  createUI(ctx) {  
    this.loginButton = <button click={() => this.login()}>login</button>
    this.logoutButton = <button click={() => this.logout()}>logout</button>
 
    this.log = document.createElement("pre");
    this.gallery = <div></div>
    this.details = <div>
      title: <input id="title" 
        keydown={evt => {if (evt.keyCode === 13) this.updateTitle()}}></input><br />
      description: <input id="description"></input>
      <ul id="comments">
      </ul>
    </div>

    var albumsButton = <button click={async () => {
      this.loadAlbums()
    }}>albums</button>

    var browseButton = <button click={async () => {
      this.browseAlbums()

    }}>browse</button>
  
  
    let style = document.createElement("style")
    style.textContent = `
      div.picture {
        display: inline-block;
        padding: 5px
      }
      
      div.picture.selected {
        outline: 2px solid blue;
      }
    `

    var pane = <div>
      {style}
      {this.loginButton}
      {this.logoutButton}
      {albumsButton}
      {browseButton}
      {this.log}
      {this.gallery}
      {this.details}
    </div>;
    pane.model = this // for debugging
     
    this.browseAlbums()
    return pane  
  }
}
new Gallery().createUI(this)
</script>




