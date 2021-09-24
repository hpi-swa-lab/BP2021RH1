# Browse


<script>
  let apiBase = `https://lively-kernel.org/bp2021dev`
  
  let loginButton = <button click={async () => {

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

  result.textContent = JSON.stringify(loginData, undefined, 2)
  
  localStorage["bp2021jwt"] = loginData.jwt 


}}>login</button>

 var logoutButton = <button click={() => {
      delete localStorage["bp2021jwt"] 
      lively.notify("logged out")
      result.textContent = ""
       loginButton.style.background = "" 
      
    }}>logout</button>
 
  var result = document.createElement("pre");

  var albumsButton = <button click={async () => {
    this.albums = await fetch('https://lively-kernel.org/bp2021dev/albums/', {
        headers: {
          authorization: "Bearer " +  localStorage["bp2021jwt"] ,
        }
      }).then(r => r.json())
    result.textContent = JSON.stringify(this.albums,undefined,  2)    
  }}>albums</button>
  
  var browseButton = <button click={async () => {
    result.innerHTML = ""
    
    
    var album = this.albums[0]
    for(let ea of album.pictures) {
      result.appendChild(<img src={apiBase + ea.Picture.media.formats.thumbnail.url}></img>)
    } 
    
  }}>browse</button>
  


  var pane = <div>{loginButton}{logoutButton}{albumsButton}{browseButton}{result}</div>;
  pane
</script>




