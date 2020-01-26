import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'

import { TextField, Button, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, Divider, Box } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'

import { Chart } from "react-google-charts"

import './App.css'

//////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////  STYLES  ////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////


const styles = theme => ({
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
	},
	toolbarSpacer: theme.mixins.toolbar,
	drawerSpacer: {
		height: '500px',
		backgroundColor: 'red'
	},
	flexboxContainer: {
		display: 'flex'
	},
	main: {
		display: 'flex',
		flexDirection: 'column',
		flex: 1
	},
	chart: {
		marginLeft: 'auto',
		marginRight: 'auto'
	}
})

//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////  APP  /////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

class App extends Component {

	constructor(props) {
		super(props)

		this.state = {

			testing: false,

			drawerItems: [
				"GenrePopularity",
				"Artist",
				"CompareArtists"
			],
			drawerSelectedIndex: null,
			drawerWidth: "250px",

			genrePopularityShow: false,
			languagePopularityShow: false,
			countryPopularityShow: false,
			searchAllShow: false,
			artistShow: false,
			compareArtistsShow: false,
			compareSongsShow: false,

			totalArtistDB: null,
			totalAlbumDB: null,
			totalSongDB: null,

			topGenre: null,
			topLanguage: null,
			topCountry: null,
			top10Country: null,
			
			searchAllInput: null,
			searchAllResult: [],
			searchAllSelection: null,

			searchArtistInput: null,
			searchArtistResult: [],
			searchArtistSelection: null,
			artistData: null,
			artistAlbumsPerYear: null,
			artistSongsPerYear: null,

			songData: null,

			searchArtist1Input: null,
			searchArtist1Result: [],
			searchArtist1Selection: null,
			artist1Data: null,

			searchArtist2Input: null,
			searchArtist2Result: [],
			searchArtist2Selection: null,
			artist2Data: null,

			compareArtistsData: null,

			searchSong1Input: null,
			searchSong1Result: [],
			searchSong1Selection: null,

			searchSong2Input: null,
			searchSong2Result: [],
			searchSong2Selection: null,
		}
	}

	/////////////////////////////////////////

	componentDidMount() {
		this.setState({ drawerWidth: document.querySelector("#menuList").getBoundingClientRect().width + "px" })
	}

	searchArtistData() {
		const searchedArtist = this.input.value.trim()
		this.setState({ artist: searchedArtist })

		const request = `https://wasabi.i3s.unice.fr/api/v1/artist/name/${encodeURI(searchedArtist)}`
		console.log(request)

		fetch(request)
			.then((response) => {
				return response.json()
			})
			.then((data) => {
				if(data != null)
					this.setState({ artistData: data })
				else
					this.setState({ artistData: {} })
				//console.log(this.state.artistData)
			})
	}

	getState() {
		console.log(this.state)
	}

	//////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////  REQUESTS  ///////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////

	getDBStats() {
		const request = "https://wasabi.i3s.unice.fr/search/dbinfo"
		fetch(request, {
				headers : { 
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				}
			})
			.then((response) => {
				return response.json()
			})
			.then((data) => {
				this.setState({
					totalArtistDB: data.nbArtist,
					totalAlbumDB: data.nbAlbum,
					totalSongDB: data.nbSong
				})
			})
	}

	getGenrePopularity(limit) {
		let request = `https://wasabi.i3s.unice.fr/api/v1/artist/genres/popularity`
		if(limit)
			request += `?limit=${limit}`

		fetch(request, {
				headers : { 
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				}
			})
			.then((response) => {
				return response.json()
			})
			.then((data) => {
				if(data == null)
					this.setState({ topGenre: null })
				else
					this.getGenrePopularityData(data)
			})
	}

	getLanguagePopularity() {
		const request = `https://wasabi.i3s.unice.fr/api/v1/song/lyrics/language/popularity`
		fetch(request, {
				headers : { 
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				}
			})
			.then((response) => {
				return response.json()
			})
			.then((data) => {
				if(data == null)
					this.setState({ topLanguage: null })
				else
					this.getLanguagePopularityData(data)
			})
	}

	getCountryPopularity(limit) {
		let request = `https://wasabi.i3s.unice.fr/api/v1/artist/country/popularity`
		if(limit)
			request += `?limit=${limit}`

		fetch(request, {
				headers : { 
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				}
			})
			.then((response) => {
				return response.json()
			})
			.then((data) => {
				if(data == null)
					this.setState({ 
						topCountry: null,
						top10Country: null
					})
				else
					this.getCountryPopularityData(data)
			})
			.catch((error) => {
				console.log(error)
			})
	}

	// Requête : recherche d'artistes et chansons
	getArtistOrSongBySearch(search) {
		const request = `https://wasabi.i3s.unice.fr/search/fulltext/${encodeURI(search)}`
		console.log(request)

		fetch(request, {
				headers : { 
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				}
			})
			.then((response) => {
				return response.json()
			})
			.then((data) => {
				if(data != null)
					this.setState({ searchAllResult: data })
				else
					this.setState({ searchAllResult: null })
			})
	}

	// Requête : recherche d'artistes
	getArtistBySearch(search, artistId) {
		const request = `https://wasabi.i3s.unice.fr/search/fulltext/${encodeURI(search)}`
		console.log(request)

		fetch(request, {
				headers : { 
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				}
			})
			.then((response) => {
				return response.json()
			})
			.then((data) => {
				let searchResult
				if(data != null)
					searchResult = data.filter(option => !option.title)
				else
					searchResult = []
				if(artistId === "artist1")
					this.setState({ searchArtist1Result: searchResult })
				else if(artistId === "artist2")
					this.setState({ searchArtist2Result: searchResult })
				else
					this.setState({ searchArtistResult: searchResult })
			})
	}

	// Requête : recherche de chansons
	getSongBySearch(search, songId) {
		const request = `https://wasabi.i3s.unice.fr/search/fulltext/${encodeURI(search)}`
		console.log(request)

		fetch(request, {
				headers : { 
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				}
			})
			.then((response) => {
				return response.json()
			})
			.then((data) => {
				let searchResult
				if(data != null)
					searchResult = data.filter(option => option.title)
				else
					searchResult = []
				if(songId === "song1")
					this.setState({ searchSong1Result: searchResult })
				else
					this.setState({ searchSong2Result: searchResult })
			})
	}

	// Requête : recherche d'un artiste par son nom
	getArtistByName(name, artistId) {
		const request = `https://wasabi.i3s.unice.fr/api/v1/artist_all/name/${encodeURI(name)}`
		console.log(request)

		fetch(request, {
				headers : { 
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				}
			})
			.then((response) => {
				return response.json()
			})
			.then((data) => {
				if(artistId === "artist1") {
					this.setState({ artist1Data: data })
					if(this.state.artist2Data)
						this.getCompareArtistsData()
				} else if(artistId === "artist2") {
					this.setState({ artist2Data: data })
					if(this.state.artist1Data)
						this.getCompareArtistsData()
				} else {
					this.setState({ artistData: data })
					this.getArtistChartData(data)
				}
			})
	}

//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////  HANDLERS  ///////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

	handleListItemSelect(e, i) {
		this.setState({ drawerSelectedIndex: i })
		switch(i) {
			case 0:
				this.setState({
					genrePopularityShow: true,
					languagePopularityShow: false,
					countryPopularityShow: false,
					artistShow: false,
					compareArtistsShow: false,
				})
				break
			case 1:
				this.setState({
					genrePopularityShow: false,
					languagePopularityShow: true,
					countryPopularityShow: false,
					artistShow: false,
					compareArtistsShow: false,
				})
				break
			case 2:
				this.setState({
					genrePopularityShow: false,
					languagePopularityShow: false,
					countryPopularityShow: true,
					artistShow: false,
					compareArtistsShow: false,
				})
				break
			case 3:
				this.setState({
					genrePopularityShow: false,
					languagePopularityShow: false,
					countryPopularityShow: false,
					artistShow: true,
					compareArtistsShow: false,
				})
				break
			case 4:
				this.setState({
					genrePopularityShow: false,
					languagePopularityShow: false,
					countryPopularityShow: false,
					artistShow: false,
					compareArtistsShow: true,
				})
				break
			default:
				this.setState({
					genrePopularityShow: false,
					languagePopularityShow: false,
					countryPopularityShow: false,
					artistShow: false,
					compareArtistsShow: false,
				})
		}
	}

	// Handler de la recherche d'artiste ou chanson (TextField onChange)
	searchAll(e) {
		const value = e.target.value.trim()
		this.setState({ searchAllInput: value })
		if(value)
			this.getArtistOrSongBySearch(value)
		else
			this.setState({ searchAllResult: null })
	}

	// Handler de la recherche d'artiste (TextField onChange)
	searchArtist(e, artistId) {
		const value = e.target.value.trim()
		if(artistId === "artist1")
			this.setState({ searchArtist1Input: value })
		else if(artistId === "artist2")
			this.setState({ searchArtist2Input: value })
		else
			this.setState({ searchArtistInput: value })
		if(value)
			this.getArtistBySearch(value, artistId)
		else {
			if(artistId === "artist1")
				this.setState({ searchArtist1Result: [] })
			else if(artistId === "artist2")
				this.setState({ searchArtist2Result: [] })
			else
				this.setState({ searchArtistResult: [] })
		}
	}

	// Handler de la recherche de chanson (TextField onChange)
	searchSong(e, songId) {
		const value = e.target.value.trim()
		if(songId === "song1")
			this.setState({ searchSong1Input: value })
		else
			this.setState({ searchSong2Input: value })
		if(value)
			this.getSongBySearch(value, songId)
		else {
			if(songId === "song1")
				this.setState({ searchSong1Result: [] })
			else
				this.setState({ searchSong2Result: [] })
		}
	}

	// Handler de la sélection d'un élément suggéré
	handleSearchOptionSelection(e, field, type) {
		const selection = e.target.textContent
		if(selection) {
			if(!type) {
				let split = selection.split("(")
				let value = split[0].trim()
				this.setState({ searchAllSelection: value })
				if(split[1] === "artiste)") {
					console.log("You've searched an artist: " + value)
					this.getArtistByName(value)
				} else
					console.log("You've searched a song: " + value)
			}
			else {
				switch(field) {
					case "artist":
						this.setState({ searchArtistSelection: selection })
						this.getArtistByName(selection)
						break
					case "artist1":
						this.setState({ searchArtist1Selection: selection })
						break
					case "artist2":
						this.setState({ searchArtist2Selection: selection })
						break
					case "song1":
						this.setState({ searchSong1Selection: selection })
						break
					case "song2":
						this.setState({ searchSong2Selection: selection })
						break
					default:
				}
				if(type === "artist")
					console.log("You've searched an artist: " + selection)
				else if(type === "song")
					console.log("You've searched a song: " + selection)
			}
		} else {
			console.log("clear " + field)
			this.clearProps(field)
		}
	}

	handleGetArtistDataButtonClick(e) {
		this.getArtistByName(this.state.searchArtistSelection)
	}

	// Handler
	handleCompareButtonClick(e, type) {
		if(type === "artist") {
			let artist1 = this.state.searchArtist1Selection
			let artist2 = this.state.searchArtist2Selection
			if(artist1 && artist2) {
				if(artist1 === artist2) {
					console.log("you want to compare the same artists")
				}
				else {
					this.getArtistByName(artist1, "artist1")
					this.getArtistByName(artist2, "artist2")
				}
			}
			else {
				console.log("missing 1 artist at least")
			}
		} 
		else {
			let song1 = this.state.searchSong1Selection
			let song2 = this.state.searchSong2Selection
			if(song1 && song2) {
				if(song1 === song2) {
					console.log("you want to compare the same songs")
				}
				else {
					//this.getSongByName(song1)
					//this.getSongByName(song2)
					console.log("TODO")
				}
			}
			else {
				console.log("missing 1 song at least")
			}
		}
	}

//////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////  DATA  /////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

	// Supprime les données correspondant à l'id donné
	clearProps(id) {
		switch(id) {
			case "artist":
				this.setState({
					searchArtistInput: null,
					searchArtistResult: [],
					searchArtistSelection: null,
					artistData: null,
					artistAlbumsPerYear: null,
					artistSongsPerYear: null
				})
				break
			case "artist1":
				this.setState({
					searchArtist1Input: null,
					searchArtist1Result: [],
					searchArtist1Selection: null,
					artist1Data: null,
					compareArtistsData: null
				})
				break
			case "artist2":
				this.setState({
					searchArtist2Input: null,
					searchArtist2Result: [],
					searchArtist2Selection: null,
					artist2Data: null,
					compareArtistsData: null
				})
				break
			case "song1":
				this.setState({
					searchSong1Input: null,
					searchSong1Result: [],
					searchSong1Selection: null,
				})
				break
			case "song2":
				this.setState({
					searchSong2Input: null,
					searchSong2Result: [],
					searchSong2Selection: null,
				})
				break
			case "all":
			default:
				this.setState({
					searchAllInput: null,
					searchAllResult: [],
					searchAllSelection: null
				})
		}
	}

	getGenrePopularityData(rawData) {
		let chartData = [["Genre", "Nombre de chansons"]]
		for(let i=0; i<rawData.length; i++){
			chartData.push([
				rawData[i]._id,
				rawData[i].sum
			])
		}
		this.setState({ topGenre: chartData })
	}

	getLanguagePopularityData(rawData) {
		let chartData = [["Langue", "Nombre de chansons"]]
		for(let i=0; i<10; i++){
			let language = rawData[i]._id
			chartData.push([
				language.charAt(0).toUpperCase() + language.substring(1),
				rawData[i].sum
			])
		}
		this.setState({ topLanguage: chartData })
	}

	getCountryPopularityData(rawData) {
		let chartData = [["Pays", "Nombre de chansons"]]
		let top10ChartData = [["Pays", "Nombre de chansons"]]
		for(let i=0; i<rawData.length; i++){
			chartData.push([
				rawData[i]._id,
				rawData[i].sum
			])
			if(i<10)
				top10ChartData.push([
					rawData[i]._id,
					rawData[i].sum
				])
		}
		this.setState({ 
			topCountry: chartData,
			top10Country: top10ChartData
		})
	}

	getArtistChartData(rawData) {
		let albumPublicationYear = {}
		let songPublicationYears = {}
		const albumList = rawData.albums
		for(let i=0; i<albumList.length; i++){
			let albumYear = albumList[i].publicationDate
			if(albumPublicationYear[albumYear])
				albumPublicationYear[albumYear]++
			else
				albumPublicationYear[albumYear] = 1
			let songList = albumList[i].songs
			for(let j=0; j<songList.length; j++){
				let songYear = songList[j].publicationDate.split('-')[0]
				if(songPublicationYears[songYear]) 
					songPublicationYears[songYear]++
				else
					songPublicationYears[songYear] = 1
			}
		}
		let albumsPerYearData = [["Année", "Nombre d'albums"]]
		const albumYears = Object.keys(albumPublicationYear)
		for(let i=0; i<albumYears.length; i++){
			let year = albumYears[i]
			if(year && year!=="0000")
				albumsPerYearData.push([parseInt(year), albumPublicationYear[year]])
		}
		let songsPerYearData = [["Année", "Nombre de chansons"]]
		const songYears = Object.keys(songPublicationYears)
		for(let i=0; i<songYears.length; i++){
			let year = songYears[i]
			if(year && year!=="0000")
				songsPerYearData.push([parseInt(year), songPublicationYears[year]])
		}
		this.setState({ 
			artistAlbumsPerYear: albumsPerYearData,
			artistSongsPerYear: songsPerYearData
		})
	}

	getCompareArtistsData() {
		const artist1 = this.state.artist1Data
		const artist2 = this.state.artist2Data
		if(artist1 && artist2) {
			let chartData = [
				[
					"Champs", 
					this.state.searchArtist1Selection, 
					this.state.searchArtist2Selection
				],[
					"Age / durée de vie",
					this.calculAge(artist1),
					this.calculAge(artist2)
				],[
					"Albums",
					this.countAlbums(artist1.albums),
					this.countAlbums(artist2.albums)
				],[
					"Chansons",
					this.countSongs(artist1.albums),
					this.countSongs(artist2.albums)
				]
			]
			this.setState({ compareArtistsData: chartData })
		}
		else {
			console.log("missing artist data")
		}
	}

	calculAge(artist) {
		let beginYear = artist.lifeSpan.begin.split("-")[0]
		if(artist.lifeSpan.ended) {
			let endYear = artist.lifeSpan.end.split("-")[0]
			return parseInt(endYear) - parseInt(beginYear)
		}
		return 2020 - parseInt(beginYear)
	}

	countAlbums(albumList) {
		let albums = 0
		for(let i=0; i<albumList.length; i++){
			if(albumList[i].publicationDate){
				albums++
			}
		}
		return albums
	}

	countSongs(albumList) {
		let songsInEachAlbum = albumList.map(x => x.songs.length)
		let songs = 0
		for(let i=0; i<songsInEachAlbum.length; i++)
			songs += songsInEachAlbum[i]
		return songs
	}

//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////  AFFICHAGE  //////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

	// Gère l'affichage d'un élément suggéré (en paramètre)
	searchOptionRendering(option, type) {
		if(type === "artist")
			return option.name
		if(option.title)
			return `${option.title} (chanson de ${option.name} de l'album ${option.albumTitle})`
		else
			return `${option.name} (artiste)`
	}

	getStateButtonDisplay() {
		if(this.state.testing)
			return <Button 
						variant="outlined"
						onClick={ this.getState.bind(this) }>
							Get state
					</Button>
	}

	topGenreChart() {
		if(this.state.genrePopularityShow) {
			if(!this.state.topGenre)
				this.getGenrePopularity(10)
			return <div>
						<h3>Popularité des genres musicaux</h3>
						<Chart
							id="topGenre"
							chartType="BarChart"
							data={this.state.topGenre}
							width={1000}
							height={700}
							options={{
								title: "Top 10 des genres musicaux les plus représentés",
								hAxis: {
									title: 'Nombre de chansons',
									format: '#'
								},
								vAxis: {
									title: 'Genres'
								},
								legend: {
									position: 'none'
								}
							}} />
					</div>
		}
	}

	topLanguageChart() {
		if(this.state.languagePopularityShow) {
			if(!this.state.topLanguage)
				this.getLanguagePopularity()
			return <div>
						<h3>Popularité des langues</h3>
						<Chart
							id="topLanguage"
							chartType="BarChart"
							data={this.state.topLanguage}
							width={1000}
							height={700}
							options={{
								title: "Top 10 des langues les plus utilisées",
								hAxis: {
									title: 'Nombre de chansons',
									format: '#'
								},
								vAxis: {
									title: 'Langues'
								},
								legend: {
									position: 'none'
								}
							}} />
					</div>
		}
	}

	topCountryChart() {
		if(this.state.countryPopularityShow) {
			if(!this.state.topCountry)
				this.getCountryPopularity()
			return <div>
						<h3>Popularité des pays</h3>
						<Chart
							id="topCountry"
							chartType="GeoChart"
							data={this.state.topCountry}
							width={1000}
							height={500}
							options={{
								title: "Carte du monde des pays producteurs de musique",
								hAxis: {
									title: 'Nombre de chansons',
									format: '#'
								},
								vAxis: { title: 'Pays' },
								legend: { position: 'none' }, 
								sizeAxis: { minValue: 0 }
							}} />
						<Chart
							id="topCountry"
							chartType="BarChart"
							data={this.state.top10Country}
							width={1000}
							height={700}
							options={{
								title: "Top 10 des pays d'origine qui produisent le plus de musique",
								hAxis: {
									title: 'Nombre de chansons',
									format: '#'
								},
								vAxis: {
									title: 'Pays'
								},
								legend: {
									position: 'none'
								}
							}} />
					</div>
		}
	}

	/*searchAllDisplay() {
		if(this.state.searchAllShow) {
			return <div>
						<h3>Chercher un artiste ou une chanson</h3>
						<Autocomplete
							freeSolo
							options={ this.state.searchAllResult.map(option => this.searchOptionRendering(option)) }
							filterOptions={ options => { return options } }
							onChange={ e => this.handleSearchOptionSelection(e) }
							renderInput={ params => (
								<TextField
									id="searchAllTextField"
									{...params}
									inputRef={ (input) => this.input = input }
									style={ { width : '300px' } }
									label="Recherche"
									margin="normal"
									variant="outlined"
									onChange={ e => this.searchAll(e) }
								/>
							) }
						/>
					</div>
		}
	}*/

	searchArtistDisplay() {
		if(this.state.artistShow) {
			if(!this.state.artistData){
				return <div>
							<h3>Chercher un artiste</h3>
							<Autocomplete
								freeSolo
								options={ this.state.searchArtistResult.map(option => this.searchOptionRendering(option, "artist")) }
								filterOptions={ options => { return options } }
								onChange={ e => this.handleSearchOptionSelection(e, "artist", "artist") }
								renderInput={ params => (
									<TextField
										id="searchAllTextField"
										{...params}
										inputRef={ (input) => this.input = input }
										style={ { width : '300px' } }
										label="Artiste"
										margin="normal"
										variant="outlined"
										onChange={ e => this.searchArtist(e, "artist") }
									/>
								) }
							/>
						</div>
			}
			else
				return <div>
							<h3>{this.state.artistData.name}</h3>
							<Chart
								chartType="ColumnChart"
								data={this.state.artistSongsPerYear}
								height={500}
								options={{
									title: 'Nombre de chansons par année',
									hAxis: {
										title: 'Années',
										format: '#',
										maxValue: 2020
									},
									vAxis: {
										title: 'Nombre de chansons',
										format: '#',
									},
									legend: {
										position: 'none'
									}
								}} />
							<Chart
								chartType="ColumnChart"
								data={this.state.artistAlbumsPerYear}
								height={500}
								options={{
									title: "Nombre d'albums par année",
									hAxis: {
										title: 'Années',
										format: '#',
										maxValue: 2020
									},
									vAxis: {
										title: "Nombre d'albums"
									},
									legend: {
										position: 'none'
									}
								}} />
							<Button 
								variant="outlined" 
								style={{ marginTop: 50 }}
								onClick={ e => this.clearProps("artist") }>
								Chercher un autre artiste
							</Button>
						</div>
		}
	}

	compareArtistsDisplay() {
		if(this.state.compareArtistsShow) {
			const data = this.state.compareArtistsData
			if(!data) {
				return <div>
							<h3>Comparer deux artistes</h3>
							<Autocomplete
								freeSolo
								options={ this.state.searchArtist1Result.map(option => this.searchOptionRendering(option, "artist")) }
								filterOptions={ options => { return options } }
								onChange={ e => this.handleSearchOptionSelection(e, "artist1", "artist") }
								renderInput={ params => (
									<TextField
										id="searchArtist1TextField"
										{...params}
										inputRef={ (input) => this.input = input }
										style={ { width : '300px' } }
										label="Artiste #1"
										margin="normal"
										variant="outlined"
										onChange={ e => this.searchArtist(e, "artist1") }
									/>
								) }
							/>
							<Autocomplete
								freeSolo
								options={ this.state.searchArtist2Result.map(option => this.searchOptionRendering(option, "artist")) }
								filterOptions={ options => { return options } }
								onChange={ e => this.handleSearchOptionSelection(e, "artist2", "artist") }
								renderInput={ params => (
									<TextField
										id="searchArtist2TextField"
										{...params}
										inputRef={ (input) => this.input = input }
										style={ { width : '300px' } }
										label="Artiste #2"
										margin="normal"
										variant="outlined"
										onChange={ e => this.searchArtist(e, "artist2") }
									/>
								) }
							/>
							<Button variant="outlined" onClick={ e => this.handleCompareButtonClick(e, "artist") }>Comparer</Button>
						</div>
			} 
			else {
				return <div>
							<h3>{this.state.artist1Data.name} vs {this.state.artist2Data.name}</h3>
							<Chart
									id="compareArtistsChart"
									chartType="BarChart"
									data={data}
									options={{
										title: 'Comparaison entre deux artistes'
									}} />
							<Button 
								variant="outlined" 
								style={{ marginTop: 50 }}
								onClick={ e => {
									this.clearProps("artist1")
									this.clearProps("artist2")
								} }>
								Faire une autre comparaison
							</Button>
						</div>
				
			}
		}
	}

	/*compareSongsDisplay() {
		if(this.state.compareSongsShow) {
			return <div>
						<h3>Comparer deux chansons</h3>
						<Autocomplete
							freeSolo
							options={ this.state.searchSong1Result.map(option => this.searchOptionRendering(option, "song")) }
							filterOptions={ options => { return options } }
							onChange={ e => this.handleSearchOptionSelection(e, "song1", "song") }
							renderInput={ params => (
								<TextField
									id="searchSong1TextField"
									{...params}
									inputRef={ (input) => this.input = input }
									style={ { width : '300px' } }
									label="Chanson #1"
									margin="normal"
									variant="outlined"
									onChange={ e => this.searchSong(e, "song1") }
								/>
							) }
						/>
						<Autocomplete
							freeSolo
							options={ this.state.searchSong2Result.map(option => this.searchOptionRendering(option, "song")) }
							filterOptions={ options => { return options } }
							onChange={ e => this.handleSearchOptionSelection(e, "song2", "song") }
							renderInput={ params => (
								<TextField
									id="searchSong2TextField"
									{...params}
									inputRef={ (input) => this.input = input }
									style={ { width : '300px' } }
									label="Chanson #2"
									margin="normal"
									variant="outlined"
									onChange={ e => this.searchSong(e, "song2") }
								/>
							) }
						/>
						<Button variant="outlined" onClick={ e => this.handleCompareButtonClick(e, "song") }>Comparer</Button>
					</div>
		}
	}*/

//////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////  RENDER  ////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

	render() {
		const { classes } = this.props

		return (
			<div className="App" style={{ height : '500px' }}>
				
				<AppBar  position="fixed" className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" noWrap>
							IBASAW
						</Typography>
						{this.getStateButtonDisplay()}
					</Toolbar>
				</AppBar>

				<Box>
					<Drawer id="drawer" variant="permanent" className={classes.drawer}>
						<Box className={classes.toolbarSpacer} />
						<List id="menuList">
							<ListItem
								button
								selected={ this.state.drawerSelectedIndex === 0 }
								onClick={ e => this.handleListItemSelect(e, 0) } >
								<ListItemText primary="Popularité des genres" />
							</ListItem>
							<ListItem
								button
								selected={ this.state.drawerSelectedIndex === 1 }
								onClick={ e => this.handleListItemSelect(e, 1) } >
								<ListItemText primary="Popularité des langues" />
							</ListItem>
							<ListItem
								button
								selected={ this.state.drawerSelectedIndex === 2 }
								onClick={ e => this.handleListItemSelect(e, 2) } >
								<ListItemText primary="Popularité des pays" />
							</ListItem>
							<Divider />
							<ListItem 
								button
								selected={ this.state.drawerSelectedIndex === 3 }
								onClick={ e => this.handleListItemSelect(e, 3) } >
								<ListItemText primary="Chercher un artiste" />
							</ListItem>
							<ListItem 
								button
								selected={ this.state.drawerSelectedIndex === 4 }
								onClick={ e => this.handleListItemSelect(e, 4) } >
								<ListItemText primary="Comparer deux artistes" />
							</ListItem>
						</List>
					</Drawer>
					<Box display="flex" flexDirection="row">
						<Box className={classes.drawerSpacer} minWidth={this.state.drawerWidth} maxWidth={this.state.drawerWidth}/>
						<Box className={classes.main}>
							<Box className={classes.toolbarSpacer} />
							{this.topGenreChart()}
							{this.topLanguageChart()}
							{this.topCountryChart()}
							{this.searchArtistDisplay()}
							{this.compareArtistsDisplay()}
						</Box>
					</Box>
				</Box>
				

				
			</div>
		)
	}
}

export default withStyles(styles)(App)