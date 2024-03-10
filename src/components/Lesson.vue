<template>
    <section>
        <!-- Main view of the page -->
        <div class="product-container" v-if="showProduct">
            <div v-for="item in products" class="product-box">
                <div>
                    <figure>
                        <img v-bind:src="'https://post-school-env.eba-ezt3sksp.eu-west-2.elasticbeanstalk.com/' + item.image"
                            alt="Book pic" style="max-width: 40%; height: auto;">
                    </figure>

                    <h4>{{ item.title }}</h4>
                    <p>Location: {{ item.location }}</p>
                    <p>Price: £{{ item.price }}</p>
                    <p>Seats: {{ item.availableInventory }}</p>

                    <button v-if="canAddToCart(item)" class="btn btn-primary" v-on:click="addItemToCart(item)">Add to
                        Cart</button>
                    <div v-else>
                        <button class="btn btn-secondary" disabled>Add to Cart</button>
                        Out of Stock
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'Lessons',
    props: ['products', 'showProduct'],
    methods: {
        addItemToCart(item) {
            this.$emit('add-item-to-cart', item);
        },
        canAddToCart(item) {
            return item.availableInventory > 0;
        },
    }  
}

</script>