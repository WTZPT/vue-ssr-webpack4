<template>
  <div id="app">
      <div id="cover"></div>
      <Header></Header>
      <Footer></Footer>
      <Todo></Todo>    
  </div>
</template>

<script>
import Header from './layout/header.vue'
import Footer from './layout/footer.jsx'
import Todo from './views/todo/todo.vue'
export default {
     components:{
         Header,
         Footer,
         Todo
     }  
}
</script>

<style>
  
</style>