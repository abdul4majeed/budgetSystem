export function reset_form_and_fields_and_empty_the_vueliadtor(v,check_boxes) 
{
    v.$reset();
    v.$touch();
    check_boxes.isTextShown = false;
    check_boxes.isDescriptionShown = false;
    check_boxes.isPriceShown = false;
    v.budget.title.$model="";
    v.budget.description.$model="";
    v.budget.price.$model="";
}

export function validate_and_show_the_error_on_submit_button_pressed(v,check_boxes)
{
    if(v.budget.$anyError)
            {
                check_boxes.isTextShown = true;
                check_boxes.isDescriptionShown = true;
                check_boxes.isPriceShown = true;
            }
            else
            {
                if(v.budget.title.$model.length<=0 && v.budget.description.$model.length<=0 && v.budget.price.$model.length<=0)
                {
                    check_boxes.isTextShown = true;
                    check_boxes.isDescriptionShown = true;
                    check_boxes.isPriceShown = true;
                }
                else
                {
                    if(v.budget.title.$model.length<=0 )
                    {
                         check_boxes.isTextShown = true;
                    }

                    if(v.budget.description.$model.length<=0)
                    {
                        check_boxes.isDescriptionShown = true;

                    }

                    if(v.budget.price.$model.length<=0)
                    {
                        check_boxes.isPriceShown = true;
                    }
                }
            }
}

export function generate_days_array(moment,days)
{
    let array_me = [];
    for (let index = 1; index <= days; index++) {
        let is_today = moment().format('D') == index;
        array_me.push({'date' : index,'is_today':is_today});
    }
    return array_me;
}