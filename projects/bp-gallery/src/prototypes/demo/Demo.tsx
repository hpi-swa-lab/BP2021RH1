import { Button, IconButton, Input, MenuItem, Select, TextField } from "@mui/material";
import { Component } from "react";
import { Collections, Login, Logout, OpenInNew, Refresh, Web } from '@mui/icons-material';

import './Demo.scss';

class Demo extends Component {

    private apiBase: string = `https://bp.bad-harzburg-stiftung.de/api/`;

    state = {loggedIn: false, albums: [], log: '', selected: null, selectAlbum: null};

    async loadAlbums() {
        const albums = await fetch(this.apiBase + '/albums/', {
            headers: {
            authorization: "Bearer " +  localStorage["bp2021jwt"] ,
            }
        }).then(r => r.json());
        this.setState({albums, log: JSON.stringify(albums, undefined, 2), selectAlbum: albums[0]});
    }

    async browseAlbums() {
        if (!this.state.albums) await this.loadAlbums()
    }

    async login() {
        let username = localStorage["bp2021username"] || "user@foo"
        username = prompt("username", username)
    
        localStorage["bp2021username"] = username
    
        var password = prompt("password", "");
    
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
            console.log('Logged in!');
            // this.loggedIn = true;
            this.setState({loggedIn: true});
        } else {
            this.setState({loggedIn: false, albums: []});
            return; 
        }
        var loginData = await resp.json();
        localStorage["bp2021jwt"] = loginData.jwt;
        this.loadAlbums();
      }

    async logout() {
        delete localStorage["bp2021jwt"];
        alert("logged out");
        this.setState({loggedIn: false, log: '', albums: []});
    }

    async updateTitle(title: string) {
        var picture = this.state.selected as any;
        if (!picture) {return; }
        var result = await this.api("PUT", "/pictures/" + picture.id, {
          id: picture.id,
          title: title
        })
        
        picture.title = result.title
        this.setState({selected: picture});
      }

    async api(method='GET', path="/", data={}) {
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

    async selectPicture(picture: any) {
        this.setState({selected: picture});
    }

    render() {
        document.body.addEventListener('pointerup', () => {
            if (this.state.selected) {
                this.setState({selected: null});
            }
        });
        return <div className='demo-component'>
            <div className='actions'>
                {!this.state.loggedIn && <Button variant="contained" onClick={() => this.login()} startIcon={<Login />}>Log In</Button>}
                {this.state.loggedIn && <Button variant="contained" onClick={() => this.logout()} startIcon={<Logout />}>Log Out</Button>}
                {this.state.loggedIn && <Button variant="outlined" onClick={() => this.loadAlbums()} startIcon={<Refresh />}>Refresh</Button>}
            </div>
            <div className='log'></div>
            {
                this.state.loggedIn && this.state.albums && this.state.albums?.length > 0 &&
                <div className='gallery-select'>
                <span style={{marginRight: '1rem'}}>Album:</span>
                <Select
                    value={this.state.selectAlbum}
                    onChange={(evt) => this.setState({selectAlbum: (evt.target as any).value})}
                >
                {
                    this.state.albums.map(album => 
                        <MenuItem key={album.id} value={album}>{album.title}</MenuItem>
                    )
                }
                </Select>
        </div>
            }
            {
                this.state.selectAlbum && 
                <div className='gallery'>
                    {
                    (this.state.albums && this.state.selectAlbum) &&
                        (this.state.selectAlbum as any).pictures.map((image: any, index: number) => 
                            <div 
                                key={image.id}
                                className={'picture' + (this.state.selected === image ? ' selected' : '')}
                                style={{animationDelay: (index * 0.1) + 's'}}
                                onClick={() => this.selectPicture(image)} 
                            >
                                <img src={this.apiBase + image.media.formats.thumbnail.url} 
                                />
                                <div className="img-operations-overlay">
                                    <IconButton onClick={() => {window.open(this.apiBase +  image.media.formats.large.url, '_blank'); }}><OpenInNew></OpenInNew></IconButton>
                                </div>
                            </div>
                        )
                    }
                </div>
            }
            {
                <div className={this.state.selected !== null && this.state.loggedIn ? 'infos open' : 'infos'}>
                    {
                        (this.state.selected !== null && this.state.loggedIn) && 
                        <div onPointerUp={(evt) => {evt.preventDefault(); evt.stopPropagation()}}>
                            <h3>Image Metadata</h3>
                            <TextField variant="filled" label='Description' id="title" onChange={evt => this.setState(() => ({
                                selected: {...this.state.selected, title: evt.target.value}
                            }))} onKeyDown={evt => (evt.keyCode === 13) && this.updateTitle((evt.target as any).value)} value={(this.state.selected as any).title}></TextField>
                        </div>
                    }
                </div>
            }
        </div>;
    }

}

export default Demo;