<template>
    <div>
                    
        <div>
            <b-button v-b-modal.modal-1>Launch demo modal</b-button>

            <b-modal ref="showBudgetList" id="showBudgetList" title="Add New Budget">
                <b-button class="mt-3" variant="outline-danger" block @click="showAddNewRecord">Add Record</b-button>
                <p class="my-4">{{clicked_date}} </p>
            </b-modal>

            <b-modal ref="addNewRecord" id="addNewRecord" title="Add New Budget Record">
                  
                <b-form @submit="onSubmit" @reset="onReset">

                 <!-- Text Field -->
                    <label for="feedback-user">Title:</label>
                    <b-input v-model.trim="$v.budget.title.$model" id="feedback-user" @focus="checkedBoxes.isTextShown =!checkedBoxes.isTextShown" @blur="checkedBoxes.isTextShown = !checkedBoxes.isTextShown" :class = "{ red_border : $v.budget.title.$invalid && checkedBoxes.isTextShown } "></b-input>
                    <div v-if="!$v.budget.title.required && checkedBoxes.isTextShown">
                        Title is required.
                    </div>
                    <div v-if="!$v.budget.title.minLength" >     
                        Minimum 4 Character Must Be Provided.
                    </div>
                 
                 <!-- Description Field -->
                    <label for="feedback-user">Description:</label>
                    <b-textarea v-model.trim="$v.budget.description.$model" id="feedback-user" @focus="checkedBoxes.isDescriptionShown = !checkedBoxes.isDescriptionShown" @blur="checkedBoxes.isDescriptionShown = !checkedBoxes.isDescriptionShown"
                    v-bind:class = "{ red_border : $v.budget.description.$invalid && checkedBoxes.isDescriptionShown } "></b-textarea>
                    <div v-if="!$v.budget.description.required && checkedBoxes.isDescriptionShown">
                        Desciption is required.
                    </div>
                    <div v-if="!$v.budget.description.minLength" >
                        Minimum 20 Character Must Be Provided.
                    </div>   

                    <!-- Price Field -->
                    <label for="feedback-user">Price:</label>
                    <b-form-input v-model.trim="$v.budget.price.$model" id="feedback-user" @focus="checkedBoxes.isPriceShown = !checkedBoxes.isPriceShown" @blur="checkedBoxes.isPriceShown = !checkedBoxes.isPriceShown"
                    v-bind:class = "{ red_border : $v.budget.price.$invalid && checkedBoxes.isPriceShown }" type="number"></b-form-input>
                    <div v-if="!$v.budget.price.required && checkedBoxes.isPriceShown">
                        Price is required.
                    </div>
                    <div v-if="!$v.budget.price.numeric" >
                        Value must be Numeric
                    </div> 

                    <b-button type="submit" variant="primary">Submit</b-button>
                    <b-button type="reset" variant="danger">Reset</b-button>
                   
                </b-form>
            </b-modal>
        </div>

        <div class="container">
            <div class="row">
                <div class="col-xs-12">
                    <ul>
                        <li v-for="day in day_name" :key="day.id" class="calender_header"><span>{{day.name}}</span></li>
                    </ul>
                </div>
            </div>
        </div>
        <div>
            <div class="container">
                <div class="row">
                    <div class="col-xs-12">
                        <ul>
                            <li v-for="array in complete_array" :key="array.date" v-bind:class="{is_today: array.is_today}" @click="showModel">
                                <div >
                                    <span id="date"> {{array.date}} </span> 
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
let moment  = require('moment');
import { required, minLength, between, numeric } from 'vuelidate/lib/validators';
let uti_fun =  require('../utility_functions.js');

export default {
    data(){
        return {
            checkedBoxes:{
                isTextShown : false,
                isDescriptionShown : false,
                isPriceShown : false,
                },
            name:'',
            age: '',
            budget:{
                title: '',
                description: '',
                price : '',
            },
            'days': 0,
            'month': 7,
            'year':2019,
            'complete_array':[],
            'day_name' : [{'id':1,'name':'Mon'},{'id':2,'name':'Tue'},{'id':3,'name':'Wed'},{'id':4,'name':'Thu'},{'id':5,'name':'Fri'},{'id':6,'name':'Sat'},{'id':7,'name':'Sun'}],
            'clicked_date' : 0,
        }
    },
    mounted() {
        
        let datey = this.year + "-" + (this.month);
        this.days = (new moment(datey, "YYYY-MM").daysInMonth());
        this.complete_array =  uti_fun.generate_days_array(moment,this.days);
    },

    methods: {
        onSubmit(e){
            let v = this.$v;
            let checkedBoxes = this.checkedBoxes;
            e.preventDefault();
        if(v.budget.$invalid)   //Check if anything is invalid here i.e. form validation is invalid i.e. Error Found
        {
            uti_fun.validate_and_show_the_error_on_submit_button_pressed(v,checkedBoxes);
        }
        else
        {
             axios.post('/api/budget', {
                       formData: this.budget,
                       date : (this.year + '/' + this.month + '/' + this.clicked_date).trim(),
                })
                .then(function (response) {
                    if(response.data.res == "ok")
                    {
                        uti_fun.reset_form_and_fields_and_empty_the_vueliadtor(v,checkedBoxes);
                        toastr.success(response.data.msg);


                    }
                })
                .catch(function (error) {
                    console.log(error.response);
                });
        }
            
        },
        onReset(){
            uti_fun.reset_form_and_fields_and_empty_the_vueliadtor(this.$v,this.checkedBoxes);
        },
        showAddNewRecord()
        {
                    this.$refs['showBudgetList'].hide();
                    this.$refs['addNewRecord'].show();
        },
        showModel(e){

                this.$refs['showBudgetList'].show();
                this.clicked_date = e.target.children[0].children[0].innerHTML;
        },
    },

    validations : {
        budget : {
            title:{
                required,
                minLength: minLength(4)
            },
             description:{
                required,
                minLength: minLength(20)
            },
            price:{
                required,
                numeric,
            }
        },
       
    }
}
</script>

<style scoped>
    ul{
        list-style: none;
    }
    ul li {
        float:left;
        width:140px;
        height:120px;
        background-color:#eeee;
        border:1px solid rgb(223, 197, 197);
    }

    .is_today{
         background-color:rgb(240, 202, 202);
        border:1px solid rgb(168, 218, 183);
    }
    .calender_header
    {
        padding-top : 5%;
        padding-left : 5%;
    }

    #date{
        float:right;
    }

    .red_border{
        border:1px solid red;
    }
</style>
