import{_ as C}from"./Tooltips-DAukjdZG.js";import{_ as w}from"./SearchBar-BTGPTjxY.js";import{_ as F}from"./ChangeModal-CwCIfM9c.js";import{_}from"./DataTable-RgBcQQQR.js";import{_ as U}from"./index-BUXYj-sS.js";import{r as S,b as k,k as j,i as l,g as t,f as n,p as o,h as p,a6 as R,a7 as M,a8 as N,a9 as h,aa as z,N as I,ab as A}from"./vendor-B24ldFEr.js";const V={class:"container"},q={style:{"margin-top":"1.5rem",height:"300px",width:"100%"}},D={style:{"margin-top":"3rem"}},P={style:{"margin-top":"3rem"}},B={style:{"margin-top":"1.5rem",width:"100%"}},E={style:{"margin-top":"3rem"}},H={style:{"margin-top":"3rem"}},O='<div class="h1">Heading 1</div>',$='<div class="h2">Heading 2</div>',Q='<div class="h3">Heading 3</div>',G='<div class="h4">Heading 4</div>',Y='<div class="text-medium">Text Medium</div>',K='<div class="text-normal">Text Normal</div>',L='<div class="text-semibold">Text Semibold</div>',J='<div class="text-small">Text Small</div>',W="<div>Default (same as semibold)</div>",X='<div class="text-grey">Text Grey</div>',Z='<div class="text-primary">Text Primary</div>',ll='<div class="text-secondary">Text Secondary</div>',el=`
<n-icon :component="AcUnitOutlined" size="30" />
`,tl=`
<Tooltips :icon="QuestionCircle20Regular" :icon-size="30">
  <div>
    Credit consumption = Companies Followed * # of Value Triggers you have subscribed to.
    <br />
    <br />
    Please visit our FAQ for more info on Credit consumption.
  </div>
</Tooltips>
`,nl=`
<SearchBar :queryFn="fetchSearchCompany" :dataTableRef="dataTableRef" />
`,ol=`
[
  {
    label: 'Full Name',
    value: '',
    type: 'text',
    placeholder: 'Your Full Name',
    showError: false,
    modalType: 'name'
  }
]
`,al=`
<ChangeModal
  :isVisible="showModal"
  modalTitle="Title"
  modalType="customize"
  :formInputs="[]"
  @update:isVisible="showModal = $event"
  @confirmChange="handleConfirmChange"
  :confirmationMessage="confirmationMessage"
  :textOnly="true"
/>
`,sl=`
<DataTable
    ref="dataTableRef"
    :query-fn="queryFn"
    :columns="columns"
    :pagination="false"
    :useCheckbox="true"
    row-key="id"
    @update:selected-rows="handleSelectRows"
/>
`,il=`
const fetchSearchCompany = async (page, pageSize, loadingFn) => {
  loadingFn(true)
  try {
    const token = YOUR_TOKEN
    const params = {
      page: page,
      limit: pageSize
    }
    const response = await useApi().get('YOUR_API_ENDPOINT', params, token)
    loadingFn(false)
    return {
      meta: {
        page: response.data.page,
        pageSize: response.data.limit,
        totalPages: response.data.totalPages,
        totalResults: response.data.totalResults
      },
      data: response.data.results
    }
  } catch (error) {
    return {
      meta: {
        page,
        pageSize,
        totalPages: 0,
        totalResults: 0
      },
      data: []
    }
  }
}
`,ul=`
[
  {
    title: 'Avatar',
    render(row) {
      return h('div', { style: { display: 'flex', alignItems: 'center' } }, [
        h('img', {
          src: row.avatar,
          style: { width: '30px', height: '30px', borderRadius: '50%', marginRight: '0.5rem' }
        }),
        h('span', row.name)
      ])
    }
  },
  {
    title: 'Value Triggers',
    key: 'value_triggers',
    render(row) {
      const valueTrigger = row.value_triggers
      return h(
        NTag,
        {
          style: {
            padding: '0.2rem 1rem',
            backgroundColor: valueTrigger > 0 ? '#F2FDF6' : '#F6F6F8',
            color: valueTrigger > 0 ? '#01913A' : '#8A949F'
          },
          strong: true,
          round: true,
          bordered: false
        },
        {
          default: () => \`\${valueTrigger} Value Triggers\`
        }
      )
    }
  },
  {
    title: 'Trending',
    key: 'trending',
    render(row) {
      const trending = Array.isArray(row.trending) ? row.trending.slice(0, 4) : []
      const uniqueTrending = [...new Set(trending)]
      return h(
        'div',
        { style: { display: 'flex', gap: '0.5rem' } },
        uniqueTrending.map((item) =>
          h(
            NTag,
            {
              style: {
                padding: '0.2rem 1rem',
                backgroundColor: '#F2FDF6',
                color: '#01913A',
                outline: '1px solid #01913A'
              },
              strong: true,
              round: true,
              bordered: false
            },
            {
              default: () => item
            }
          )
        )
      )
    }
  }
]
`,dl={__name:"design-information",setup(rl){const r=S(!1),g=[{title:"ID",key:"id"},{title:"Name",key:"name"},{title:"Age",key:"age"}],f=()=>{};return(d,e)=>{const v=_,i=M,a=N,s=h,u=z,b=F,y=w,x=I,c=C,T=A;return k(),j("div",V,[e[60]||(e[60]=l("div",{class:"h1"},"Component Usage",-1)),t(T,{style:{margin:"1rem 0"}},{default:n(()=>[t(u,null,{default:n(()=>[l("div",q,[e[2]||(e[2]=l("div",{class:"h2"},"DataTable",-1)),t(v,{ref:"dataTableRef",style:{"background-color":"grey",height:"100%"},"query-fn":f,columns:g,pagination:!1,useCheckbox:!0,"row-key":"id","onUpdate:selectedRows":d.handleSelectRows},null,8,["onUpdate:selectedRows"])]),l("div",D,[e[12]||(e[12]=l("div",{class:"h3"},"Data Table information",-1)),l("ul",null,[t(s,null,{default:n(()=>[t(a,{title:"Usage",name:"1"},{default:n(()=>[t(i,{code:sl,language:"javascript"})]),_:1})]),_:1}),e[8]||(e[8]=l("li",{style:{"margin-top":"1rem"}},[l("span",{class:"text-bold"},"ref"),o(" : ref is the reference to the DataTable component you can use it to get the dataTableRef ")],-1)),l("li",null,[e[3]||(e[3]=l("span",{class:"text-bold"},"queryFn",-1)),e[4]||(e[4]=o(" : props the function to fetch data in the table.")),e[5]||(e[5]=l("br",null,null,-1)),t(s,null,{default:n(()=>[t(a,{title:"Example",name:"1"},{default:n(()=>[t(i,{code:il,language:"javascript"})]),_:1})]),_:1})]),l("li",null,[e[6]||(e[6]=l("span",{class:"text-bold"},"columns",-1)),e[7]||(e[7]=o(" : columns of the table. you can customize the columns by using render function ")),t(s,null,{default:n(()=>[t(a,{title:"Example",name:"1"},{default:n(()=>[t(i,{code:ul,language:"javascript"})]),_:1})]),_:1})]),e[9]||(e[9]=l("li",null,[l("span",{class:"text-bold"},"pagination"),o(" : boolean to enable pagination")],-1)),e[10]||(e[10]=l("li",null,[l("span",{class:"text-bold"},"useCheckbox"),o(" : boolean to enable checkbox")],-1)),e[11]||(e[11]=l("li",null,[l("span",{class:"text-bold"},"rowKey"),o(" : key of the row if you want to use checkbox ")],-1))])])]),_:1}),e[54]||(e[54]=l("div",{style:{"border-top":"3px solid #e5e5e5","margin-top":"3rem"}},null,-1)),t(u,null,{default:n(()=>[l("div",null,[e[13]||(e[13]=l("h2",{class:"text-bold"},"Modal",-1)),l("button",{onClick:e[0]||(e[0]=m=>r.value=!0)},"Show Modal"),t(b,{isVisible:p(r),modalTitle:"Title",modalType:"customize",formInputs:[],"onUpdate:isVisible":e[1]||(e[1]=m=>r.value=m),onConfirmChange:d.handleConfirmChange},null,8,["isVisible","onConfirmChange"])]),l("div",P,[e[27]||(e[27]=l("h3",{class:"text-bold"},"Modal information",-1)),l("ul",null,[t(s,null,{default:n(()=>[t(a,{title:"Usage",name:"1"},{default:n(()=>[t(i,{code:al,language:"javascript"})]),_:1})]),_:1}),e[22]||(e[22]=l("li",null,[l("span",{class:"text-bold"},"isVisible"),o(" : boolean to control the visibility of the modal ")],-1)),e[23]||(e[23]=l("li",null,[l("span",{class:"text-bold"},"modalTitle"),o(" : title of the modal")],-1)),l("li",null,[e[18]||(e[18]=l("span",{class:"text-bold"},"modalType",-1)),e[19]||(e[19]=o(" : type of the modal. you can use customize, email, password, confirmationModal ")),t(s,null,{default:n(()=>[t(a,{title:"customize",name:"1"},{default:n(()=>e[14]||(e[14]=[l("div",null,[l("ul",null,[l("li",null,[l("span",{class:"text-bold"},"customize"),o(" is the most flexible type. you can customize the form inputs by form input component and you can give anything structure you want ")])])],-1)])),_:1})]),_:1}),t(s,null,{default:n(()=>[t(a,{title:"email",name:"1"},{default:n(()=>e[15]||(e[15]=[l("div",null,[l("ul",null,[l("li",null,[l("span",{class:"text-bold"},"email"),o(" : type for any input except password input because password have their own behavior ")])])],-1)])),_:1})]),_:1}),t(s,null,{default:n(()=>[t(a,{title:"password",name:"1"},{default:n(()=>e[16]||(e[16]=[l("div",null,[l("ul",null,[l("li",null,[l("span",{class:"text-bold"},"password"),o(" : type for password input")])])],-1)])),_:1})]),_:1}),t(s,null,{default:n(()=>[t(a,{title:"confirmationModal",name:"1"},{default:n(()=>e[17]||(e[17]=[l("div",null,[l("ul",null,[l("li",null,[l("span",{class:"text-bold"},"confirmationModal"),o(" : type for only confirmation modal its only have two button cancel and confirm ")])])],-1)])),_:1})]),_:1})]),l("li",null,[e[20]||(e[20]=l("span",{class:"text-bold"},"formInputs",-1)),e[21]||(e[21]=o(" : array of form inputs. you can customize the form inputs by using the form input component and you can give empty array if you want to use confirmation modalType or modalType without form inputs ")),t(s,null,{default:n(()=>[t(a,{title:"Example",name:"1"},{default:n(()=>[t(i,{code:ol,language:"javascript"})]),_:1})]),_:1})]),e[24]||(e[24]=l("li",null,[l("span",{class:"text-bold"},"confirmChange"),o(" : function to handle the confirmation of the modal ")],-1)),e[25]||(e[25]=l("li",null,[l("span",{class:"text-bold"},"Validation"),o(" : Each input type has its own validation rules. you can add your own validation in the child or inside component modal. for example: "),l("ul",null,[l("li",null,[l("strong",null,"Name:"),o(" Cannot be empty, max length 50, no special characters or numbers. ")]),l("li",null,[l("strong",null,"Phone:"),o(" Must be between 9 to 12 digits.")]),l("li",null,[l("strong",null,"Password:"),o(" Cannot be empty.")]),l("li",null,[l("strong",null,"Email:"),o(" Must be a valid email format.")]),l("li",null,[l("strong",null,"Company URL:"),o(" Must be a valid URL starting with http:// or https://. ")])])],-1)),e[26]||(e[26]=l("li",null,[l("span",{class:"text-bold"},"Error Handling"),o(" : If validation fails, an error message will be displayed next to the respective input field. ")],-1))])])]),_:1}),e[55]||(e[55]=l("div",{style:{"border-top":"3px solid #e5e5e5","margin-top":"3rem"}},null,-1)),t(u,null,{default:n(()=>[l("div",B,[e[28]||(e[28]=l("h2",{class:"text-bold"},"SearchBar",-1)),t(y,{queryFn:d.fetchSearchCompany,isNavigation:!0},null,8,["queryFn"])]),l("div",E,[e[31]||(e[31]=l("h3",{class:"text-bold"},"SearchBar information",-1)),l("ul",null,[t(s,null,{default:n(()=>[t(a,{title:"Usage",name:"1"},{default:n(()=>[t(i,{code:nl,language:"javascript"})]),_:1})]),_:1}),e[29]||(e[29]=l("li",{style:{"margin-top":"1rem"}},[l("span",{class:"text-bold"},"queryFn"),o(" : props the function to fetch data in the table. same as DataTable props queryFn ")],-1)),e[30]||(e[30]=l("li",null,[l("span",{class:"text-bold"},"isNavigation"),o(" : boolean to control the behavior of the searchBar. if true the searchBar can be used as navigation and if false the searchBar will appear follow or unfollow button ")],-1))])])]),_:1}),e[56]||(e[56]=l("div",{style:{"border-top":"3px solid #e5e5e5","margin-top":"3rem"}},null,-1)),t(u,null,{default:n(()=>[l("div",null,[e[32]||(e[32]=l("h2",{class:"text-bold"},"Icon",-1)),t(x,{component:p(R),size:"30"},null,8,["component"])]),l("ul",null,[l("li",null,[e[33]||(e[33]=l("span",{class:"text-bold"},"Icon",-1)),e[34]||(e[34]=o(" : Icon is use n-icon component. you can use any icon from n-icon ")),t(s,null,{default:n(()=>[t(a,{title:"Example",name:"1"},{default:n(()=>[t(i,{code:el,language:"javascript"})]),_:1})]),_:1})])])]),_:1}),e[57]||(e[57]=l("div",{style:{"border-top":"3px solid #e5e5e5","margin-top":"3rem"}},null,-1)),t(u,null,{default:n(()=>[l("div",null,[e[36]||(e[36]=l("h2",{class:"text-bold"},"Tooltips",-1)),t(c,{icon:d.QuestionCircle20Regular,"icon-size":30},{default:n(()=>e[35]||(e[35]=[l("div",null,[o(" Credit consumption = Companies Followed * # of Value Triggers you have subscribed to. "),l("br"),l("br"),o(" Please visit our FAQ for more info on Credit consumption. ")],-1)])),_:1},8,["icon"])]),l("div",H,[e[38]||(e[38]=l("h3",{class:"text-bold"},"Tooltips information",-1)),l("ul",null,[t(s,null,{default:n(()=>[t(a,{title:"Usage",name:"1"},{default:n(()=>[t(i,{code:tl,language:"javascript"})]),_:1})]),_:1}),e[37]||(e[37]=l("li",null,[l("span",{class:"text-bold"},"Tooltips"),o(" : Tooltips is use slot. you can customize the content of the tooltips by using slot ")],-1))])])]),_:1}),e[58]||(e[58]=l("div",{style:{"border-top":"3px solid #e5e5e5","margin-top":"3rem"}},null,-1)),t(u,null,{default:n(()=>[l("div",null,[e[53]||(e[53]=l("h2",{class:"text-bold"},"Typography",-1)),l("div",null,[l("div",null,[e[39]||(e[39]=l("div",{class:"h1"},"Heading 1",-1)),l("ul",null,[t(s,null,{default:n(()=>[t(a,{title:"Usage",name:"1"},{default:n(()=>[t(i,{code:O,language:"javascript"})]),_:1})]),_:1})])]),l("div",null,[e[40]||(e[40]=l("div",{class:"h2"},"Heading 2",-1)),l("ul",null,[t(s,null,{default:n(()=>[t(a,{title:"Usage",name:"1"},{default:n(()=>[t(i,{code:$,language:"javascript"})]),_:1})]),_:1})])]),l("div",null,[e[41]||(e[41]=l("div",{class:"h3"},"Heading 3",-1)),l("ul",null,[t(s,null,{default:n(()=>[t(a,{title:"Usage",name:"1"},{default:n(()=>[t(i,{code:Q,language:"javascript"})]),_:1})]),_:1})])]),l("div",null,[e[42]||(e[42]=l("div",{class:"h4"},"Heading 4",-1)),l("ul",null,[t(s,null,{default:n(()=>[t(a,{title:"Usage",name:"1"},{default:n(()=>[t(i,{code:G,language:"javascript"})]),_:1})]),_:1})])]),l("div",null,[e[45]||(e[45]=l("div",{class:"text-large"},"Text Medium",-1)),l("ul",null,[t(s,null,{default:n(()=>[t(a,{title:"Usage",name:"1"},{default:n(()=>[e[43]||(e[43]=l("span",{class:"text-bold"},"info",-1)),e[44]||(e[44]=o(" : same as h1 but weight is 400 ")),t(i,{code:Y,language:"javascript"})]),_:1})]),_:1})])]),l("div",null,[e[46]||(e[46]=l("div",{class:"text-normal"},"Text Normal",-1)),l("ul",null,[t(s,null,{default:n(()=>[t(a,{title:"Usage",name:"1"},{default:n(()=>[t(i,{code:K,language:"javascript"})]),_:1})]),_:1})])]),l("div",null,[e[47]||(e[47]=l("div",{class:"text-semibold"},"Text Semibold",-1)),l("ul",null,[t(s,null,{default:n(()=>[t(a,{title:"Usage",name:"1"},{default:n(()=>[t(i,{code:L,language:"javascript"})]),_:1})]),_:1})])]),l("div",null,[e[48]||(e[48]=l("div",{class:"text-small"},"Text Small",-1)),l("ul",null,[t(s,null,{default:n(()=>[t(a,{title:"Usage",name:"1"},{default:n(()=>[t(i,{code:J,language:"javascript"})]),_:1})]),_:1})])]),l("div",null,[e[49]||(e[49]=l("div",null,"Default (same as semibold)",-1)),l("ul",null,[t(s,null,{default:n(()=>[t(a,{title:"Usage",name:"1"},{default:n(()=>[t(i,{code:W,language:"javascript"})]),_:1})]),_:1})])]),l("div",null,[e[50]||(e[50]=l("div",{class:"text-grey"},"Text Grey",-1)),l("ul",null,[t(s,null,{default:n(()=>[t(a,{title:"Usage",name:"1"},{default:n(()=>[t(i,{code:X,language:"javascript"})]),_:1})]),_:1})])]),l("div",null,[e[51]||(e[51]=l("div",{class:"text-primary"},"Text Primary",-1)),l("ul",null,[t(s,null,{default:n(()=>[t(a,{title:"Usage",name:"1"},{default:n(()=>[t(i,{code:Z,language:"javascript"})]),_:1})]),_:1})])]),l("div",null,[e[52]||(e[52]=l("div",{class:"text-secondary"},"Text Secondary",-1)),l("ul",null,[t(s,null,{default:n(()=>[t(a,{title:"Usage",name:"1"},{default:n(()=>[t(i,{code:ll,language:"javascript"})]),_:1})]),_:1})])])])])]),_:1}),e[59]||(e[59]=l("div",{style:{"border-top":"3px solid #e5e5e5","margin-top":"3rem"}},null,-1))]),_:1})])}}},yl=U(dl,[["__scopeId","data-v-e59bc054"]]);export{yl as default};
