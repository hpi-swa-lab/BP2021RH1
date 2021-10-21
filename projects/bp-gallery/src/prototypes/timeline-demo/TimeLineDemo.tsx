import { Component, createRef, MutableRefObject } from "react";
import { stringify } from 'qs';
import { sanitize } from 'dompurify';

import './TimeLineDemo.scss';
import dayjs from "dayjs";

import Timeline from './Timeline';
import BPImage from './BPImage';

export default class TimeLineDemo extends Component {
    state = {
        topLevelDescription: '',
        currentImage: null,
        images: [],
        timeRange: {
            start: '1900',
            end: '1999'
        },
        currentCategories: []
    };

    private apiBase = 'https://bp.bad-harzburg-stiftung.de/api/';

    private searchQuery = '';

    private async queryApi() {
        const startTime = new Date(this.state.timeRange.start+'-01-01');
        const endTime = new Date(this.state.timeRange.end + '-12-31');
        const params = {
            _where: [
                {
                    'time_range_tag.start_gte': dayjs(startTime).format('YYYY-MM-DDTHH:mm'),
                    'time_range_tag.end_lte': dayjs(endTime).format('YYYY-MM-DDTHH:mm'),
                }
            ],
            _sort: 'time_range_tag.start:ASC'
        };
        const targets = ['descriptions.text_contains', 'title.text_contains', 'keyword_tags.name_contains'];
        let images = [];
        for (const target of targets) {
            const targetCopy = JSON.parse(JSON.stringify(params));
            targetCopy._where[0][target] = this.searchQuery;
            const query = stringify(targetCopy);
            const response = await fetch(this.apiBase + `pictures?${query}`).then(resp => resp.json());
            images = images.concat(
                // eslint-disable-next-line no-loop-func
                response.filter(newImage =>
                    !images.find(existingImage => existingImage.id === newImage.id)
                )
            );
        }
        this.setState({images});
    }

    async componentDidMount() {
        const query = stringify({
            _where: {
                priority: 1
            }
        });
        const categories = await fetch(this.apiBase + `category-tags?${query}`).then(resp => resp.json());
        this.setState({topLevelDescription: categories[0].description, currentCategories: [categories[0]]});
        this.queryApi();
    }

    private handleTimelineChange(start: number, end: number) {
        this.setState({timeRange: {start, end}});
        this.queryApi();
    }

    render() {
        return <div className='timeline-demo'>
            <h1 className='center title'>Das Herbert-Ahrens-Bilderarchiv</h1>
            <p
                className='center'
                style={{width: '90%', maxWidth: '800px', marginTop: '2rem'}}
                dangerouslySetInnerHTML={{__html: sanitize(this.state.topLevelDescription)}}
            ></p>
            <div className='center' style={{height: '64px'}}></div>
            <div className='breadcrumbs'>
                {
                    this.state.currentCategories.map((cat, index) => {
                        return <div key={index} className='breadcrumb'>
                            <span>{cat.name}</span>
                        </div>
                    })
                }
            </div>
            <div className='center search-bar'>
                <input autoComplete="off" placeholder="Suchen..." type='text'
                    onChange={(event) => {
                        this.searchQuery = (event.target as HTMLInputElement).value;
                    }}
                    onKeyDown={(event) => {
                        if (event.keyCode === 13) {
                            this.queryApi();
                        }
                    }}
                    onBlur={() => {
                        this.queryApi();
                    }}
                id='search' name='search'/>
            </div>
            <div className='center' style={{height: '28px'}}></div>
            {/* <h3 className='center'>Kategorien</h3>
            <div className='center' id='current_categories'></div>
            <div className='center' id='categories'></div>
            <div className='center' style={{height: '64px'}}></div> */}
            <h3 className='center'>Aufnahmedatum</h3>
            <Timeline handleChange={this.handleTimelineChange.bind(this)}/>
            <div id='image-grid'>
                {
                    this.state.images.map((img, index) =>
                        <BPImage key={img.id} image={img} index={index} apiBase={this.apiBase}/>
                    )
                }
            </div>
        </div>
    }
}
