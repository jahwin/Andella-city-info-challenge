const app = {
        data: {
            api_url: 'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json',
            search_result: [],
            keyword: "",
        },
        methods: {
            //Allow to get 100 rows first data on screen
            showData: (data) => {
                var result_preview = document.querySelector('#search-result');
                var html_content = "";
                if (data) {
                    data.forEach((item, index) => {
                        html_content += app.methods.createHtmlItem(item, index);
                    });
                    result_preview.innerHTML = html_content;
                }
            },
            // Allow to show and hide loading status
            Loading: (status) => {
                var loading_status = document.querySelector('#loading-status');
                if (status) {
                    loading_status.classList.add('show');
                    loading_status.classList.remove('hide');
                } else {
                    loading_status.classList.remove('show');
                    loading_status.classList.add('hide');
                }
            },
            // Allow to get data on first time
            getData: () => {
                app.methods.Loading(true);
                fetch(app.data.api_url)
                    .then((response) => {
                        return response.json();
                    })
                    .then((result) => {
                        app.data.search_result = result;
                        app.methods.showData(result);
                        app.methods.Loading(false);
                    });
            },
            // Allow to create html item
            createHtmlItem: (item, index) => {
                    var color = parseFloat(item.growth_from_2000_to_2013.replace('%', '')) < 0 ? 'red' : 'green';
                    var html = ` 
            <!-- Start of search item -->
            <div class="search-item" onClick='showSingleItem(${JSON.stringify(item)})'>
                <h2 class="item-number">${index+1}</h2>
                <table>
                    <tr>
                        <th align="center">City</th>
                        <th align="center">State</th>
                        <th align="center">population</th>
                        <th align="center">Growth</th>
                    </tr>
                    <tr>
                        <td align="center">${item.city.replace( new RegExp(app.data.keyword,"i"),`<span style="background-color:yellow;text-transform:capitalize">${app.data.keyword}</span>`)}</td>
                        <td align="center">${item.state.replace( new RegExp(app.data.keyword,"i"),`<span style="background-color:yellow;text-transform:capitalize">${app.data.keyword}</span>`)}</td>
                        <td align="center">${parseInt(item.population).toLocaleString()}</td>
                        <td align="center"><span style="color:${color}">${item.growth_from_2000_to_2013 }<span></td>
                    </tr>
                </table>
            </div>
            <!-- End of search item -->`;
        return html;
    },
    // Allow to validate input value
    validateInput: (value) => {
        document.querySelector('.error-label').innerHTML = "";
        if (app.data.search_result.length !== 0) {
            if (value === "") {
                document.querySelector('#search-title').innerHTML = "";
                app.methods.showData(app.data.search_result);
                return false;
            } else {
                if (!value.match(/^[a-zA-Z\s]+$/g)) {
                    document.querySelector('#search-title').innerHTML = "";
                    document.querySelector('.error-label').innerHTML = "Please use only characters";
                    return false;
                }
            }
            return true;
        }
    },
    //Allow to search data
    seachData: (value) => {
        app.data.keyword = value;
        var searched_data = app.data.search_result.filter((item) => {
            var city = item.city.toLowerCase();
            var state = item.state.toLowerCase();
            return city.includes(value.toLowerCase()) || state.includes(value.toLowerCase());
        });
        app.methods.showData(searched_data);
    }

}
};
// Get data from api
app.methods.getData();
//input  events
var typingTimer;
document.querySelector('#search-input').addEventListener('keyup', ({ target }) => {
app.methods.Loading(true);
if (app.methods.validateInput(target.value)) {
    document.querySelector('#search-title').innerHTML = `Search result on "<span style="background-color:yellow">${target.value}</span>" keyword`;
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
        app.methods.seachData(target.value);
        app.methods.Loading(false);
    }, 500);
}
});

const showSingleItem = (data) => {
var html = `
<h4>City</h4>
<p>${data.city}</p>
<h4>Growth</h4>
<p>${data.growth_from_2000_to_2013}</p>
<h4>Latitude</h4>
<p>${data.latitude }</p>
<h4>Longitude</h4>
<p>${data.longitude }</p>
<h4>Population</h4>
<p>${data.population}</p>
<h4>Rank</h4>
<p>${data.rank }</p>
<h4>State</h4>
<p>${data.state}</p>
<a target="_brank" href="https://maps.google.com/?q=${data.latitude},${data.longitude}" >See on map</a>
`;
document.querySelector('#modal-widget').classList.add('show');
document.querySelector('#modal-widget').classList.remove('hide');
document.querySelector('#modal-body').innerHTML = html;
console.log(data);
}

const closeModal = () => {
document.querySelector('#modal-widget').classList.add('hide');
document.querySelector('#modal-widget').classList.remove('show');
};