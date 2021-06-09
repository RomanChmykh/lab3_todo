<template>
    <div class="app">
        <div class="container">
            <div class="row header">
                <h1 class="col s6 offset-s3 center-align teal-text">To-Do List!</h1>
            </div>
            <div class="row">
                <form @submit.prevent="submitTodo" class="col s6 offset-s3">
                    <div class="input-field">
                        <i class="material-icons prefix">list</i>
                        <textarea class="materialize-textarea" id="icon_prefix2" v-model="newTodo"></textarea>
                        <label for="icon_prefix2">What to do?</label>
                    </div>
                    <button class="btn waves-effect col s12">Add</button>
                </form>
            </div>
            <div class="row">
                <ul class="collection col s6 offset-s3">
                    <li :key="todo.id" class="collection-item" v-for="todo in todos">
                        <p>
                            <label>
                                <input :checked=todo.done @change="changeTodo(todo)" type="checkbox"/>
                                <span>{{todo.text}}</span>
                                <span style="float: right">
                                  <a @click.prevent="deleteTodo(todo)">
                                    <i class="material-icons right teal-text">delete</i>
                                  </a>
                                </span>
                                <span style="float: right">{{todo.created}}</span>
                            </label>
                        </p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>

  import axios from 'axios';

  export default {
        name: 'app',
        data() {
            return {
                todos: [],
                newTodo: '',
            };
        },
        mounted() {
            axios.get('http://localhost:3000/')
                .then((response) => {
                    this.todos = response.data;
                });
        },
        methods: {
            submitTodo() {
                if (this.newTodo !== '') {
                    axios.post(`http://localhost:3000/?text=${this.newTodo}`)
                        .then((response) => {
                            this.todos.push({
                                text: response.data.text,
                                // eslint-disable-next-line no-underscore-dangle
                                _id: response.data._id,
                                done: response.data.done,
                                created: response.data.created,
                            });
                            this.newTodo = '';
                        });
                }
            },
            deleteTodo(todo) {
                axios.delete(`http://localhost:3000/?_id=${todo._id}`)
                    .then((response) => {
                        if (response.data === true) {
                            const todoIndex = this.todos.indexOf(todo);
                            this.todos.splice(todoIndex, 1);
                        }
                    });
            },
            changeTodo(todo) {
                axios.post(`http://localhost:3000/mark?_id=${todo._id}&done=${!todo.done}`)
                    .then(() => {
                        todo.done = !todo.done;
                    });
            },
        },

    };
</script>

<style lang="scss">
    .header {
        margin-top: 100px;
    }
</style>
