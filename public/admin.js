var app = new Vue({
  el: '#admin',
  created() {
    this.getItems();
  },
  data: {
    title: "",
    selected:  "",
    description: "",
    addItem: null,
    photos: [
      {name: 'Abraham Lincoln', id: 1, path: 'images/abe_lincoln_riding_a_grizzly.jpg', info: '"No man has a good enough memory to be a successful liar" -Abe'},
      {name: 'George Bush', id: 2, path: 'images/george_dubya_bush.jpg', info: '"It\'s clearly a budget. It\'s got a lot of numbers in it" -George'},
      {name: 'George Washington 1', id: 3, path: 'images/george_warshington.jpg', info: '"It is far better to be alone, than to be in bad company." -Georgy'},
      {name: 'George Washington 2', id: 4, path: 'images/george_washington_the_original_master_chief.jpg', info: '"My first wish is to see this plague of mankind, war, banished from the earth." -Georgy'},
      {name: 'George Washington 3', id: 5, path: 'images/george_washington_zombiehunter.jpg', info: '"Let your discourse with men of business be short and comprehensive." -Georgy},
      {name: 'John F Kennedy', id: 6, path: 'images/john_f_kennedy_alien_hunter.jpg', info: '"Things do not happen. Things are made to happen." -JFK'},
      {name: 'Barack Obama', id: 7, path: 'images/obama_riding_a_lion.jpg', info: '"I\'m the president of the United States. I\'m not the emperor of the United States." -Obama'},
      {name: 'Richard Nixon', id: 8, path: 'images/richard_nixon_fighting_a_saber_tooth_tiger.jpg', info: '"Well, I screwed it up real good, didn\'t I?" -Richy'},
      {name: 'Ronald Reagan 1', id: 9, path: 'images/ronald_reagan_riding_a_velociraptor.jpg', info: '"When you can\'t make them see the light, make them feel the heat." -Ron'},
      {name: 'Ronald Reagan 2', id: 10, path: 'images/ronald_reagan_the_liberator.jpg', info: '"Inflation is as violent as a mugger, as frightening as an armed robber and as deadly as a hit man." -Ron'},
      {name: 'Theodore Roosevelt', id: 11, path: 'images/teddy_roosevelt_vs__bigfoot.jpg', info: '"Man was never intended to become an oyster." -Teddy'},
      {name: 'Thomas Jefferson', id: 12, path: 'images/thomas_jefferson_vs_gorilla.jpg', info: '"When we get piled upon one another in large cities, as in Europe, we shall become as corrupt as Europe." -Tommy'},
    ],
    items: [],
    findTitle: "",
    findItem: null,
  },
  methods: {
    async addNewItem(){
      try {
        let result = await axios.post('/api/items', {
          title: this.title,
          path: this.selected.path,
          description: this.description
        });
        this.addItem = result.data;
      } catch (error) {
        console.log(error);
      }
    },
    async addRandomItem(){
      try {
        min = Math.ceil(1);
        max = Math.floor(12);
        let randomID = Math.floor(Math.random() * (max - min + 1)) + min;
        this.selected = this.photos[randomID];
        this.title = this.photos[randomID].name;
        this.description = this.photos[randomID].info;
        this.addNewItem();
      } catch (error) {
        console.log(error);
      }
    },
    async getItems() {
      try {
        let response = await axios.get("/api/items");
        this.items = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    selectItem(item) {
      this.findTitle = "";
      this.findItem = item;
    },
    async deleteItem(item) {
      try {
        let response = await axios.delete("/api/items/" + item.id);
        this.findItem = null;
        this.getItems();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async editItem(item) {
      try {
        let response = await axios.put("/api/items/" + item.id, {
          title: this.findItem.title,
          description: this.findItem.description
        });
        this.findItem = null;
        this.getItems();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
  },
  computed: {
    suggestions() {
      return this.items.filter(item => item.title.toLowerCase().startsWith(this.findTitle.toLowerCase()));
    }
  },
});
