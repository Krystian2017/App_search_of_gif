const GIPHY_PUB_KEY = 'qYJUoExqhocza5OQXzJpzFgXT2AxuaGW';
const GIPHY_API_URL = 'https://api.giphy.com';

App = React.createClass({

  getInitialState() {
    return {
      loading: false,
      searchingText: '',
      gif: {}
    };
  },

  handleSearch: function(searchingText) { // 1. Pobiera tekst
    this.setState({
      loading: true    // 2. proces ładowania
    });

    this.getGif(searchingText).then((gif) => {  // 3. pobieranie gifa
      this.setState({     // 4. koniec pobierania
        loading: false,   // a przestaje sygnalizować ładowanie
        gif: gif,         // b ustawia nowego gifa z wyniku pobierania
        searchingText: searchingText  // c nowy stan dla wyszukiwanego tekstu
      });
    }) 
  },

  getGif: function(searchingText) { // 1. tekst + funkcja po pobraniu gifa
    return new Promise((resolve, reject) => {
      let url = GIPHY_API_URL + '/v1/gifs/random?api_key=' + GIPHY_PUB_KEY + '&tag=' + searchingText; // 2. konstruujemy URL
      const xhr = new XMLHttpRequest(); // 3. zapytanie do serwera
      xhr.open('GET', url);
      xhr.onload = function() {
        if (xhr.status === 200) {
          let data = JSON.parse(xhr.responseText).data; // 4. rozpakowujemy obiekt z danymi
          let gif = { // 5. układamy obiekt gif
          url: data.fixed_width_downsampled_url,
          sourceUrl: data.url
          };
          resolve(gif); // 6. przekazujemy obiekt do callback
        } else {
            reject(new Error(xhr.statusText));
        }
      };
      xhr.send();
    });
  },

  render: function() {

    const styles = {
      margin: '0 auto',
      textAlign: 'center',
      width: '100%'
    };

    return (
      <div style={styles}>
        <div className="header">
          <h1>GIF search engine</h1>
          <p>Find GIF on: <a href='http://giphy.com'>giphy.com</a> <br/> 
          Press enter to load more.
          </p>
          <Search onSearch={this.handleSearch}/>
        </div>
        <Gif
          loading={this.state.loading}
          url={this.state.gif.url}
          sourceUrl={this.state.gif.sourceUrl}
        />
      </div>
    );
  }
});