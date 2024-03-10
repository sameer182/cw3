<template>
  <div id="app">
    <div>

      <strong class="test-elemen">HTTPS link: <a v-bind:href="serverURL" target="_blank">link</a></strong>

      <button @click="deleteAllCaches" class="test-elem">
        <font-awesome-icon icon="fas fa-trash" />
        Delete All Caches
      </button>

      <button @click="unregisterAllServiceWorkers" class="test-elem">
        <font-awesome-icon icon="fab fa-uniregistry" />
        Unregister All ServiceWorkers
      </button>
      <button @click="reloadPage" class="test-elem">
        <font-awesome-icon icon="fas fa-sync" />
        Reload Page
      </button>

    </div>

    <header>
      <h1 style="font-weight: bold" v-text="sitename"></h1>

      <button class="btn btn-primary" v-on:click="showCheckout" :disabled="!showCheckoutButton">
        {{ itemsInCart }}
        <span class="fa-solid fa-cart-shopping"></span> Checkout
      </button>

    </header>
    <!-- Search bar and sort buttons --->
    <div class="button-container" v-if="showProduct">
      <div class="row">
        <div class="col-12 col-md-7 offset-md-3">
          <div class="input-group mb-1">
            <input type="text" v-model="searchText" class="form-control form-input" style="border-radius: 20px;"
              placeholder="Search products">
            <div class="input-group-append">
              <button class="btn btn-secondary" v-on:click="showAsc('title'); sortBy('title');">Title</button>
              <button class="btn btn-secondary" v-on:click="showAsc('location'); sortBy('location');">Location</button>
              <button class="btn btn-secondary" v-on:click="showAsc('price'); sortBy('price');">Price</button>
              <button class="btn btn-secondary" v-on:click="showAsc('seat'); sortBy('seat');">Seat</button>
              <div style="display: inline-block;" v-if="showDefault">
                <span v-if="showArrowIcon" class="fa-solid fa-arrow-up fa-lg"></span>
                <span v-else class="fa-solid fa-arrow-down fa-lg"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <main>
 <component  :is="currentview" :cart="cart" :products="products" :showProduct="showProduct" @add-item-to-cart="addItemToCart" 
              @submit-order="submitOrder" @remove-item="removeItemFromCart">
  </component>
 </main>
  </div>
</template>

<script>
import Lesson from "./components/Lesson.vue";
import Checkout from "./components/CheckOut.vue";
export default {
  name: "App",
  data() {
    return {
      sortDirection: {
        title: 1,
        location: 1,
        price: 1,
        seat: 1,
      },
      sitename: "Bridge Course Store",
      showProduct: true,
      products: [],
      name: '',
      phoneNumber: '',
      showArrow: true,
      showDefault: false,
      searchText: '',
      cart: [],
      order: {},
      serverURL: "https://post-school-env.eba-ezt3sksp.eu-west-2.elasticbeanstalk.com/collections/lessons",
      currentview: "Lesson",
    }
  },
  components: {
    Lesson,
    Checkout,
  },
  computed: {
    cartItemsWithQuantity: function () {
      const cartItemsWithQuantity = [];
      this.cart.forEach((item) => {
        const existingItem = cartItemsWithQuantity.find((cartItem) => cartItem.item.id === item.id);
        if (existingItem) {
          existingItem.quantity++;
        } else {
          cartItemsWithQuantity.push({ item: item, quantity: 1 });
        }
      });
      return cartItemsWithQuantity;
    },
    showCheckoutButton() {
      return this.cart.length > 0;
    },
    itemsInCart: function () {
      return this.cart.length || "";
    },
    checkInput: function () {
      const namePattern = /^[a-zA-Z ]+$/;
      return namePattern.test(this.name);
    },
    checkPhoneInput: function () {
      const phonePattern = /^[\d]{10}$/;
      return phonePattern.test(this.phoneNumber);
    },
    isFormValid: function () {
      return this.checkInput && this.checkPhoneInput;
    },
    showArrowIcon() {
      return this.showArrow;
    },

  },
  methods: {
    showCheckout: function () {
      this.showProduct = this.showProduct ? false : true;
    },
    addItemToCart: function (item) {
      if (item.availableInventory >= 1) {
        this.cart.push(item);
        item.availableInventory -= 1;
      }
    },
    removeItemFromCart: function (index) {
      const removedItem = this.cart.splice(index, 1)[0];
      removedItem.availableInventory += 1;
      if (this.cart.length == 0) {
        this.showProduct = true;
      }
    },
    canAddToCart: function (item) {
      return item.availableInventory > 0;
    },
    //Sorting direction for the specified key
    sortBy: function (key) {
      const direction = this.sortDirection[key];
      if (key === "title") {
        this.products.sort((a, b) =>
          (a.title > b.title ? 1 : -1) * direction
        );
      } else if (key === "location") {
        this.products.sort((a, b) =>
          (a.location > b.location ? 1 : -1) * direction
        );
      } else if (key === "price") {
        this.products.sort((a, b) =>
          (a.price - b.price) * direction);
      } else if (key === "seat") {
        this.products.sort((a, b) =>
          (a.availableInventory - b.availableInventory) * direction
        );
      }
      //Toggle the sorting direction  
      this.sortDirection[key] = -direction;
    },
    //Fetch functions that saves new order with POST when submitted and PUT method that updates the available space
    submitOrder: function () {
      //Assigning data to the order object
      this.order.name = this.name;
      this.order.phoneNumber = this.phoneNumber;
      this.order.id = this.cartItemsWithQuantity.map(a => a.item.id);
      this.order.spaces = this.cartItemsWithQuantity.map(item => item.quantity);
      fetch('https://post-school-env.eba-ezt3sksp.eu-west-2.elasticbeanstalk.com/submit-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        //convert order object to Json string and send it as request body
        body: JSON.stringify(this.order)
      })
        .then(response => response.json())
        .then(data => {
          console.log('Order submitted:', data);
          // Sending a PUT request to update available spaces after order submission
          return fetch('https://post-school-env.eba-ezt3sksp.eu-west-2.elasticbeanstalk.com/collections/lessons', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: this.order.id, spaces: this.order.spaces })
          });
        })
        .then(response => response.json())
        .then(data => {
          this.products = data; //Update the products array with the response data
          if (window.confirm('Order submitted successfully! Thankyou :)')) {
            location.reload();
          }
        })
        .catch(err => {
          console.error('Error:', err);
          window.alert('Error submitting order.');
        });
    },

    showAsc: function (key) {
      this.showDefault = true;
      if (this.sortDirection[key] == 1) {
        this.showArrow = true;
      } else {
        this.showArrow = false;
      }
    },
    //Search products using the webservice
    searchProducts() {
      const key = this.searchText.toLowerCase().trim();
      if (key === "") {
        //Fetch all products when the search query is empty
        fetch('https://post-school-env.eba-ezt3sksp.eu-west-2.elasticbeanstalk.com/collections/lessons')
          .then(response => response.json())
          .then(data => this.products = data)
          .catch(err => console.error('Error:', err));
      } else {
        //Sends the search query to the server
        fetch(`https://post-school-env.eba-ezt3sksp.eu-west-2.elasticbeanstalk.com/lessons/search/${key}`)
          .then(response => response.json())
          .then(data => this.products = data)
          .catch(err => console.error('Error:', err));
      }
    },
    deleteAllCaches() {
        caches.keys().then(function (names) {
            for (let name of names)
                caches.delete(name);
        });
        console.log("All Caches Deleted");
    },
    unregisterAllServiceWorkers() {
        navigator.serviceWorker.getRegistrations().then(function (registrations) {
            for (let registration of registrations) {
                registration.unregister()
            }
        });
        console.log("ServiceWorkers Unregistered");
    },
    reloadPage() {
        window.location.reload();
    },

  },
  watch: {
    //Watch for changes in searchText and triggers the searchProducts method
    searchText: function (newText, oldText) {
      //Check if new search text is different
      if (newText !== oldText) {
        this.searchProducts();
      }
    },
  },
  //Fetch function to retreive data from the server
  created: function () {
    //Register the service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("service-worker.js");
    }

    fetch('https://post-school-env.eba-ezt3sksp.eu-west-2.elasticbeanstalk.com/collections/lessons')
      .then(response => response.json()) //parse to json
      .then(data => this.products = data) //update the products array with response data
      .catch(err => console.error('Error:', err));


  },
};

</script>