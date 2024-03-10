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
                    <input type="text" id="name" name="name" placeholder="Enter full name" v-model.trim="name"
                        required />
                    <span style="color: red; font-size: 14px;" v-if="!checkInput">Please enter only characters.</span>
                </div>
                <div class="input-box">
                    <label for="phone">Phone Number</label>
                    <input type="tel" id="phone" name="phone" placeholder="Enter phone number"
                        v-model.trim="phoneNumber" maxlength="10" required>
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
            <p><b>Full Name :</b> {{ name }}</p>
            <p><b>Phone Number :</b> {{ phoneNumber }}</p>
        </div>
    </div>

</template>
<script>
export default {
    name: 'CheckOut',
    props: ['order', 'cart', 'cartItemsWithQuantity'],
    methods: {
        submitOrder() {
            this.$emit('submit-order');
        },
        removeItemFromCart(index) {
            this.$emit('remove-item', index);
        },
    }  
}

</script>