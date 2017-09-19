import React, { Component } from 'react';
import './App.css';

const TodoList=(props)=>{
    return(
        <ul>
            {
                props.todos.map(todo=>
                <li key={todo.id}>
                    <label>
                        <input type="checkbox" checked={todo.isCompleted} onChange={currentTodo=>props.onSetTodoStatus(todo,currentTodo.target.checked)}/>
                    {todo.text}
                    </label>
                </li>
                )
            }
        </ul>
    );
}
class TodoForm extends Component{
    constructor(props){
        super(props);
        this._onSubmit = this._onSubmit.bind(this);
    }
    render(){
        return(
            <form onSubmit={this._onSubmit}>
                {/* In order to capture the input value we used "ref" which is used in onSubmit function */}
                <input type='text' ref={input=>this._textInput=input}/>
                <button>submit</button>
            </form>
        );
    }
    focusOnText=()=>{
        this._textInput.focus();
    }
    _onSubmit=(e)=>{
        e.preventDefault();
        const textInput = this._textInput.value.trim();
        if(textInput.length===0) return;
        this._textInput.value="";
        //In order to send objects from child to parent we can simply create a prop in parent which implements a function
        //with required params obtained from child. For example, we need to pass 'textInput' to parent. so we created a function
        //'_onAddTodo' in parent which take text as an input and added as prop to <ToDoForm/>
        //and here we declare that prop name and pass the required value to it.
        this.props.onAddProp(textInput);
    }
}
//PropTypes are used to specify if a particular object is required or not. This allows to display user friendly error messages
TodoForm.propTypes={
    onAddProp:React.PropTypes.func.isRequired
};
class App extends Component {
    constructor(props){
        super(props);
        this._nextToDo = 1;
        //always bind funnctions to save the context
        this._onCheckChange = this._onCheckChange.bind(this);
        this._setToDoStatus = this._setToDoStatus.bind(this);
        this._onAddTodo = this._onAddTodo.bind(this);
        this.state={
            filter:{
                showCompleted:true
            },
            todos:[
                {id:this._nextToDo++,text:"Show1",isCompleted:false},
                {id:this._nextToDo++,text:"Show2",isCompleted:true},
                {id:this._nextToDo++,text:"Show3",isCompleted:false},
                {id:this._nextToDo++,text:"Show4",isCompleted:true},
                {id:this._nextToDo++,text:"Show5",isCompleted:false}
            ]
        };
    }
    componentDidMount(){
        this._todoForm.focusOnText();
    }
    render(){
        const{filter,todos}=this.state;
        const filterTodos = filter.showCompleted
                            ? todos
                            : todos.filter(todo=>!todo.isCompleted);
        return(
            <div>
                <h2>ToDo List</h2>
                <label>Show Completed</label>
                <input type="checkbox" checked={filter.showCompleted} onChange={this._onCheckChange}/>
                <TodoList todos={filterTodos} onSetTodoStatus={this._setToDoStatus} />
                {/* To get the reference of 'TodoForm' we can use ref.  '_todoForm' acts as instance of TodoForm which can be used 
                to call its methods, in this use we made a call to focusOnText method*/}
                <TodoForm onAddProp={this._onAddTodo} ref = {form=>this._todoForm=form} />
            </div>
        );
    }
    //this function is invoked when user clicks on checkbox then todos array is updated with the corresponding change and re-renders the view
    //Object.assign(ObjectToReturn,params...): this function here creates a new object with oldTodo which is updated with the recent change (isCompleted)
    _setToDoStatus=(todo,isCompleted)=>{
        const{todos}=this.state;
        this.setState({
            todos:todos.map(oldTodo=>{
                if(oldTodo.id!==todo.id)
                    return oldTodo;
                return Object.assign({},oldTodo,{isCompleted});
            })
        })
    };
    //this 'text' is obtained from propTypes
    _onAddTodo=(text)=>{
        this.setState({
           todos: this.state.todos.concat({
               id:this._nextToDo++,
               text,
               isCompleted:false
           })
        });
    }
    _onCheckChange=(event)=>{
        event.persist();
        this.setState(prevState=>({
            filter:{showCompleted:event.target.checked}
        }));
    }
}

export default App;
