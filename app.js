$(function(){
				
    let problem_cnt;

    //문제 API 데이터 가져오는 ajax
    $.ajax({
        url:"/api/fetchProblem",
        success:function(data){
            const p_list = eval(data).problems;
            problem_cnt = p_list.length;
            

            $.each(p_list,function(idx,p){
                
                let problem_sub = $("<div></div>").addClass("problem_sub").attr("id",p.id).html(p.id+". "+p.problem_text);
                let choices = $("<div class='problem_choices'><span class='re_text'>나의 답 : </span></div>");
                let re_choices = $("<div class='problem_choices'><span>정답 : </span></div>").addClass("re");

                if(p.type==1){
                    const c_list = eval(p.choices);
                    $.each(c_list,function(i,c){

                        const radio_answer = $("<input type='radio'/>").attr({"name":"answer"+p.id,"class":"answer"+p.id,"data-type":"radio"}).val(i+1);
                        const radio_text =$("<span></span>").addClass("radio_text").html(c);
                        $(choices).append(radio_answer,radio_text);

                        const re_radio_answer = $("<input type='radio' disabled/>");
                        if(i+1==Number(p.answer)){
                            $(re_radio_answer).attr("checked","checked");
                        }				
                        const re_radio_text =$("<span></span>").addClass("radio_text").html(c);
                        $(re_choices).append(re_radio_answer,re_radio_text);
                    });
                }
                if(p.type==2){
                    const text_answer = $("<input type='text'/>").attr({"name":"answer"+p.id,"class":"answer"+p.id,"data-type":"text"});
                    $(choices).append(text_answer);

                    const re_text_answer = $("<input type='text' readonly/>").val(p.answer);
                    $(re_choices).append(re_text_answer);

                }

                $(".problem").append( problem_sub.append(choices,re_choices));
            });
        }
    }
    );


    // POST API 활용 DB insert / 결과값 화면 반영 
    $("#submit").click(function(){
        // event.preventDefault();
        let answer_Data = new Array();

        for(let i=1 ; i<=problem_cnt ; i++){

            const data_type = $(".answer"+i).attr("data-type");
            let user_answer;
            if(data_type=="radio"){
                user_answer = $("input[name=answer"+i+"]:checked").val();
            }
            if(data_type=="text"){
                user_answer = $("input[name=answer"+i+"]").val();
            }

            answer_Data.push({"id":i,"answer":user_answer});
        }
        let answer_json = new Object();
        answer_json['input'] = JSON.stringify(answer_Data);

        $.ajax({
            url:'/api/submit',
            dataType:'json',
            type:'POST',
            data:answer_json,
            success:function(data){
                const a_list = eval(data).results;
                $.each(a_list,function(idx,a){
                    const a_id = $("<span class='re_list'></span>").html(a.id+". ");
                    let a_re = $("<span></span>");
                    if(a.result==true){
                        $(a_re).html("O");
                    }else{
                        $(a_re).html("X");
                    }

                    const result_sub = $("<div></div>").addClass("result_sub").append(a_id,a_re);
                    $(".result").append(result_sub);

                    $(".re").css("display","block");
                    $(".re_text").css("display","inline");
                });
                
            }
        });
        
        
    });

});
