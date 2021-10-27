import React, { Component } from 'react';
import { stringify } from 'qs';
import './Demo.scss';
import Actions from './Actions';
import Gallery from './Gallery';
import TagMultiSelect from './TagMultiSelect';
import PictureSidebar from './PictureSidebar';

interface DemoState {
  loggedIn: boolean;
  tagDataLoading: boolean;
  categories: any[];
  keywords: any[];
  timeRanges: any[];
  selectedCategories: any[];
  selectedKeywords: any[];
  selectedTimeRanges: any[];
  pictures: any[];
  pictureCount: number;
  currentPicturePage: number;
  selectedPicture: any | null;
  log: string;
}

class Demo extends Component {
  private apiBase = 'https://bp.bad-harzburg-stiftung.de/api/';

  private defaultPicturePageSize = 21;

  private initialState: DemoState = {
    loggedIn: false,
    tagDataLoading: false,
    categories: [],
    keywords: [],
    timeRanges: [],
    selectedCategories: [],
    selectedKeywords: [],
    selectedTimeRanges: [],
    pictures: [],
    pictureCount: 0,
    currentPicturePage: 1,
    selectedPicture: null,
    log: '',
  };

  state = this.initialState;

  resetState() {
    this.setState(this.initialState);
  }

  async login() {
    if (!localStorage['bp2021jwt']) {
      let username = localStorage['bp2021username'] || 'user@foo';
      // eslint-disable-next-line
      username = prompt('Username', username);
      localStorage['bp2021username'] = username;

      // eslint-disable-next-line
      const password = prompt('Password', '');

      const resp = await fetch(`${this.apiBase}/auth/local`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          identifier: username,
          password: password,
        }),
      });

      if (resp.status === 200) {
        console.log('Logged in!');
      } else {
        this.resetState();
        return;
      }
      const loginData = await resp.json();
      localStorage['bp2021jwt'] = loginData.jwt;
    }

    this.setState({
      loggedIn: true,
    });
    await this.loadTagData();
    await this.loadPictures(this.state.currentPicturePage);
  }

  async logout() {
    delete localStorage['bp2021jwt'];
    // eslint-disable-next-line
    alert('logged out');
    this.resetState();
  }

  async api(method: string = 'GET', path: string = '/', data: any = undefined) {
    const resp = await fetch(`${this.apiBase}${path}`, {
      method: method,
      headers: {
        authorization: `Bearer ${localStorage['bp2021jwt'] as string}`,
        'content-type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    return resp.json();
  }

  async loadCategories() {
    const categories = await this.api('GET', 'Category-Tags?_limit=-1');
    this.setState({
      categories,
      log: JSON.stringify(categories, undefined, 2),
      selectedCategories: [categories[0]],
    });
  }

  async loadKeywords() {
    const keywords = await this.api('GET', 'Keyword-Tags?_limit=-1');
    this.setState({
      keywords,
      log: JSON.stringify(keywords, undefined, 2),
    });
  }

  /**
   * currently unused
   */
  async loadTimeRanges() {
    const timeRanges: any[] = await this.api('GET', 'Time-Range-Tags?_limit=-1');
    const mappedTimeRanges: any[] = timeRanges.map((timeRange: any) => ({
      ...timeRange,
      // Use only the year info of timeRanges
      name: `${(timeRange.start as string).substring(0, 4)} - 
      ${(timeRange.end as string).substring(0, 4)}`,
    }));
    this.setState({
      timeRanges: mappedTimeRanges,
      log: JSON.stringify(timeRanges, undefined, 2),
    });
  }

  async loadTagData() {
    this.setState({
      tagDataLoading: true,
    });
    await this.loadCategories();
    await this.loadKeywords();
    // await this.loadTimeRanges();
    this.setState({
      tagDataLoading: false,
    });
  }

  async countPicturesForQuery(queryString: string) {
    const pictureCount = await this.api('GET', `pictures/count?${queryString}`);
    this.setState({
      pictureCount,
      log: JSON.stringify(pictureCount, undefined, 2),
    });
  }

  async loadPictures(pageToLoad: number) {
    const { selectedCategories, selectedKeywords, selectedTimeRanges } = this.state;

    const queryString = stringify(
      {
        _where: {
          _or: [
            {
              'category_tags.id': selectedCategories.map(category => category.id),
            },
            {
              'keyword_tags.id': selectedKeywords.map(keyword => keyword.id),
            },
            {
              'time_range_tag.id': selectedTimeRanges.map(timeRange => timeRange.id),
            },
          ],
        },
        _limit: this.defaultPicturePageSize,
        _start: (pageToLoad - 1) * this.defaultPicturePageSize,
      },
      { encode: false }
    );

    const pictures = await this.api('GET', `pictures?${queryString}`);
    this.setState({
      pictures,
      log: JSON.stringify(pictures, undefined, 2),
    });

    await this.countPicturesForQuery(queryString);
  }

  /**
   * currently unused
   * Additionally, it probably won't work now, as title is a separate object now.
   */
  async updateTitle(title: string) {
    const picture: any = this.state.selectedPicture;
    if (!picture) {
      return;
    }
    const result = await this.api('PUT', `/pictures/${picture.id as number}`, {
      id: picture.id,
      title: title,
    });

    picture.title = result.title;
    this.setState({ selectedPicture: picture });
  }

  /**
   * currently unused
   */
  changeTitle(title: string) {
    this.setState({
      selectedPicture: { ...this.state.selectedPicture, title: title },
    });
  }

  selectPicture(picture: any) {
    this.setState({
      selectedPicture: picture,
    });
  }

  selectCategories(categories: any[]) {
    this.setState({
      selectedCategories: categories,
    });
  }

  selectKeywords(keywords: any[]) {
    this.setState({
      selectedKeywords: keywords,
    });
  }

  selectTimeRanges(timeRanges: any[]) {
    this.setState({
      selectedTimeRanges: timeRanges,
    });
  }

  async selectPage(page: number) {
    await this.loadPictures(page);
    this.setState({
      currentPicturePage: page,
    });
  }

  render() {
    const {
      loggedIn,
      tagDataLoading,
      categories,
      keywords,
      timeRanges,
      pictures,
      pictureCount,
      currentPicturePage,
      selectedCategories,
      selectedKeywords,
      selectedTimeRanges,
      selectedPicture,
    } = this.state;

    document.body.addEventListener('pointerup', () => {
      if (this.state.selectedPicture) {
        this.setState({ selectedPicture: null });
      }
    });

    const tagMultiSelects = tagDataLoading ? (
      <h3>Loading Tag Data...</h3>
    ) : (
      <div className='gallery-select'>
        <TagMultiSelect
          label='Categories'
          values={categories}
          selectedValues={selectedCategories}
          onValueChange={values => this.selectCategories(values)}
          onSelectClose={() => this.selectPage(1)}
        />
        <TagMultiSelect
          label='Keywords'
          values={keywords}
          selectedValues={selectedKeywords}
          onValueChange={values => this.selectKeywords(values)}
          onSelectClose={() => this.selectPage(1)}
        />
        <TagMultiSelect
          disabled
          label='Time-Ranges'
          values={timeRanges}
          selectedValues={selectedTimeRanges}
          onValueChange={values => this.selectTimeRanges(values)}
          onSelectClose={() => this.selectPage(1)}
        />
      </div>
    );

    const loggedInContent = (
      <>
        {tagMultiSelects}
        <Gallery
          apiBase={this.apiBase}
          pictures={pictures}
          pageCount={Math.ceil(pictureCount / this.defaultPicturePageSize)}
          currentPage={currentPicturePage}
          onPageChange={value => this.selectPage(value)}
          selectedPicture={selectedPicture}
          onPictureSelect={picture => this.selectPicture(picture)}
        />
        <PictureSidebar
          selectedPicture={selectedPicture}
          onTitleChange={value => this.changeTitle(value)}
          onTitleUpdate={value => this.updateTitle(value)}
        />
      </>
    );

    return (
      <div className='demo-component'>
        <Actions
          loggedIn={loggedIn}
          onLogin={() => this.login()}
          onLogout={() => this.logout()}
          pictureLoadDisabled={tagDataLoading}
          onPictureLoad={() => this.selectPage(1)}
        />
        <div className='log' />
        {loggedIn && loggedInContent}
      </div>
    );
  }
}

export default Demo;
