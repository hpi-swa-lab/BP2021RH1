import React, { Component } from 'react';
import { stringify } from 'qs';
import { sanitize } from 'dompurify';
import './TimeLineDemo.scss';
import dayjs from 'dayjs';
import Timeline from './Timeline';
import BPImage from './BPImage';
import { IconButton } from '@mui/material';
import { NavigateNext, NavigateBefore } from '@mui/icons-material';

interface TimeLineDemoState {
  topLevelDescription: string;
  images: any[];
  timeRange: {
    start: string;
    end: string;
  };
  currentCategories: any[];
  currentSubCategories: any[];
  showControls: boolean;
}

export default class TimeLineDemo extends Component {
  state: TimeLineDemoState = {
    topLevelDescription: '',
    images: [],
    timeRange: {
      start: '1900',
      end: '1999',
    },
    currentCategories: [],
    currentSubCategories: [],
    showControls: false,
  };

  private apiBase = 'https://bp.bad-harzburg-stiftung.de/api/';

  private searchQuery = '';

  private async queryApi() {
    const startTime = new Date(this.state.timeRange.start + '-01-01');
    const endTime = new Date(this.state.timeRange.end + '-12-31');
    const params = {
      _where: [
        {
          'time_range_tag.start_gte': dayjs(startTime).format('YYYY-MM-DDTHH:mm'),
          'time_range_tag.end_lte': dayjs(endTime).format('YYYY-MM-DDTHH:mm'),
        },
      ],
      _sort: 'time_range_tag.start:ASC',
      categories: this.state.currentCategories.map(cat => cat.id),
    };
    const targets = [
      'descriptions.text_contains',
      'title.text_contains',
      'keyword_tags.name_contains',
    ];
    let images: any[] = [];
    for (const target of targets) {
      const targetCopy = JSON.parse(JSON.stringify(params));
      targetCopy._where[0][target] = this.searchQuery;
      const query: string = stringify(targetCopy);
      const response: any[] = await fetch(this.apiBase + `pictures?${query}`).then(resp =>
        resp.json()
      );
      images = images.concat(
        // eslint-disable-next-line no-loop-func
        response.filter(
          (newImage: any) => !images.find(existingImage => existingImage.id === newImage.id)
        )
      );
    }
    this.setState({ images });
  }

  async querySubTags(tagId: number) {
    const query = stringify({
      _where: {
        id: tagId,
      },
    });
    const category: any[] = await fetch(this.apiBase + `category-tags?${query}`).then(resp =>
      resp.json()
    );
    this.setState({
      currentSubCategories: category[0].related_tags,
      topLevelDescription: category[0].description,
      currentCategories: this.state.currentCategories.concat([category[0]]),
    });
  }

  async componentDidMount() {
    await this.querySubTags(1);
    await this.queryApi();
  }

  private async handleTimelineChange(start: number, end: number) {
    this.setState({ timeRange: { start, end } });
    await this.queryApi();
  }

  private nextImage() {
    let prevIndex = -2;
    this.setState({
      images: this.state.images.map((img: any, index: number) => {
        if (img.isCurrentImage) {
          prevIndex = index;
        }
        return {
          ...img,
          isCurrentImage: index === prevIndex + 1,
        };
      }),
    });
  }

  private previousImage() {
    this.setState({
      images: this.state.images.map((img: any, index: number) => {
        return {
          ...img,
          isCurrentImage: this.state.images[index + 1]?.isCurrentImage ? true : false,
        };
      }),
    });
  }

  render() {
    return (
      <div className='timeline-demo'>
        <h1 className='center title'>Das Herbert-Ahrens-Bilderarchiv</h1>
        <p
          className='center'
          style={{ width: '90%', maxWidth: '800px', marginTop: '2rem' }}
          dangerouslySetInnerHTML={{
            __html: sanitize(this.state.topLevelDescription),
          }}
        ></p>
        <div className='center' style={{ height: '64px' }}></div>
        <div className='center search-bar'>
          <input
            autoComplete='off'
            placeholder='Suchen...'
            type='text'
            onChange={event => {
              this.searchQuery = (event.target as HTMLInputElement).value;
            }}
            onKeyDown={async event => {
              if (event.keyCode === 13) {
                await this.queryApi();
              }
            }}
            onBlur={async () => {
              await this.queryApi();
            }}
            id='search'
            name='search'
          />
        </div>
        <div className='center' style={{ height: '64px' }}></div>
        <h3 className='center'>Aufnahmedatum</h3>
        <Timeline handleChange={this.handleTimelineChange.bind(this)} />
        <div className='breadcrumbs'>
          {this.state.currentCategories.map((cat: any, index: number) => {
            return (
              <div
                key={index}
                className='breadcrumb'
                onClick={async () => {
                  if (this.state.currentCategories.length < 2) {
                    return;
                  }
                  this.setState({
                    currentCategories: this.state.currentCategories.slice(0, index),
                  });
                  await this.querySubTags(cat.id as number);
                  await this.queryApi();
                }}
              >
                <span>{cat.name}</span>
              </div>
            );
          })}
        </div>
        <div className='center' style={{ height: '28px' }}></div>
        {this.state.currentSubCategories.length > 0 && (
          <div className='cats'>
            <h3 className='center'>Kategorien</h3>
            <div className='center category-grid'>
              {this.state.currentSubCategories.map((cat, index) => {
                return (
                  <div
                    key={index}
                    className='category'
                    onClick={async () => {
                      await this.querySubTags(cat.id as number);
                      await this.queryApi();
                    }}
                  >
                    <span dangerouslySetInnerHTML={{ __html: sanitize(cat.name as string) }}></span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <div className='center' style={{ height: '28px' }}></div>
        <div id='image-grid'>
          {this.state.images.map((img: any, index: number) => (
            <BPImage
              key={img.id}
              image={img}
              index={index}
              apiBase={this.apiBase}
              onToggleView={(open: boolean) => {
                const imgs = this.state.images;
                imgs[index].isCurrentImage = open;
                this.setState({
                  showControls: open,
                  images: imgs,
                });
              }}
            />
          ))}
        </div>
        {this.state.showControls && (
          <div className='buttons-next-previous'>
            <IconButton
              className='previous'
              onClick={() => {
                this.previousImage();
              }}
            >
              <NavigateBefore />
            </IconButton>
            <IconButton
              className='next'
              onClick={() => {
                this.nextImage();
              }}
            >
              <NavigateNext />
            </IconButton>
          </div>
        )}
      </div>
    );
  }
}
