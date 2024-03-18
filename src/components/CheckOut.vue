<template>
    <!-- Checkout Page -->
    <div>
        <h1 class="h1">Welcome to the Checkout Page</h1>
        <div v-for="(cartItem, index) in cartItemsWithQuantity" :key="index" class="product-box1">
            <div>
                <figure>
                    <img v-bind:src="'https://post-school-env.eba-ezt3sksp.eu-west-2.elasticbeanstalk.com/' + cartItem.item.image"
                        alt="Book pic" style="max-width: 40%; height: auto;">
                </figure>

                <h4>{{ cartItem.item.title }}</h4>
                <p>Location: {{ cartItem.item.location }}</p>
                <p>Price: £{{ cartItem.item.price }}</p>
                <p>Quantity: {{ cartItem.quantity }}</p>
                <button class="btn btn-danger" v-on:click="removeItemFromCart(index)">Remove from Cart</button>

            </div>
        </div>
        <!-- Customer form inputs for ordering -->
        <footer class="custom-footer">
            <div class="form-box">
                <div class="input-box">
                    <label for="name">Full Name</label>
                    <input type="text" id="name" name="name" placeholder="Enter full name" v-model.trim="order.name"
                        required />
                    <span style="color: red; font-size: 14px;" v-if="!checkInput">Please enter only characters.</span>
                </div>
                <div class="input-box">
                    <label for="phone">Phone Number</label>
                    <input type="tel" id="phone" name="phone" placeholder="Enter phone number"
                        v-model.trim="order.phoneNumber" maxlength="10" required>
                    <span style="color: red; font-size: 14px;" v-if="!checkPhoneInput">Please enter atleast 10
                        numbers.</span>
                </div>

                <button type="submit" @click="submitOrder" class="btn btn-primary"
                    :disabled="!isFormValid">Order</button>

            </div>
        </footer>
        <!-- Order information -->
        <div class="order-info">
            <h2><b>Order Information</b></h2>
            <p><b>Full Name :</b> {{ order.name }}</p>
            <p><b>Phone Number :</b> {{ order.phoneNumber }}</p>
        </div>
    </div>

</template>
<script>
export default {
    name: 'Checkout',
    props: ['order','cart'],
    methods: {
        submitOrder() {
            this.$emit('submit-order');
        },
        removeItemFromCart(index) {
            this.$emit('remove-item', index);
        },
    },
    computed: {
        checkInput: function () {
            const namePattern = /^[a-zA-Z ]+$/;
            return namePattern.test(this.order.name);
        },
        checkPhoneInput: function () {
            const phonePattern = /^[\d]{10}$/;
            return phonePattern.test(this.order.phoneNumber);
        },
        isFormValid: function () {
            return this.checkInput && this.checkPhoneInput;
        },
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
    }  
}

</script>