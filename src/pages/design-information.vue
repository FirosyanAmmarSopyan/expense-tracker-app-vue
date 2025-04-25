<template>
  <div class="container">
    <div class="h1">Component Usage</div>
    <n-list style="margin: 1rem 0">
      <n-list-item>
        <div style="margin-top: 1.5rem; height: 300px; width: 100%">
          <div class="h2">DataTable</div>
          <DataTable
            ref="dataTableRef"
            style="background-color: grey; height: 100%"
            :query-fn="queryFn"
            :columns="columns"
            :pagination="false"
            :useCheckbox="true"
            row-key="id"
            @update:selected-rows="handleSelectRows"
          />
        </div>
        <div style="margin-top: 3rem">
          <div class="h3">Data Table information</div>
          <ul>
            <n-collapse>
              <n-collapse-item title="Usage" name="1">
                <n-code :code="tableCode" language="javascript" />
              </n-collapse-item>
            </n-collapse>
            <li style="margin-top: 1rem">
              <span class="text-bold">ref</span> : ref is the reference to the DataTable component
              you can use it to get the dataTableRef
            </li>
            <li>
              <span class="text-bold">queryFn</span> : props the function to fetch data in the
              table.<br />
              <n-collapse>
                <n-collapse-item title="Example" name="1">
                  <n-code :code="queryFnTableCode" language="javascript" />
                </n-collapse-item>
              </n-collapse>
            </li>
            <li>
              <span class="text-bold">columns</span> : columns of the table. you can customize the
              columns by using render function
              <n-collapse>
                <n-collapse-item title="Example" name="1">
                  <n-code :code="columnsTableCode" language="javascript" />
                </n-collapse-item>
              </n-collapse>
            </li>
            <li><span class="text-bold">pagination</span> : boolean to enable pagination</li>
            <li><span class="text-bold">useCheckbox</span> : boolean to enable checkbox</li>
            <li>
              <span class="text-bold">rowKey</span> : key of the row if you want to use checkbox
            </li>
          </ul>
        </div>
      </n-list-item>
      <div style="border-top: 3px solid #e5e5e5; margin-top: 3rem"></div>
      <n-list-item>
        <div>
          <h2 class="text-bold">Modal</h2>
          <button @click="showModal = true">Show Modal</button>
          <ChangeModal
            :isVisible="showModal"
            modalTitle="Title"
            modalType="customize"
            :formInputs="[]"
            @update:isVisible="showModal = $event"
            @confirmChange="handleConfirmChange"
          />
        </div>
        <div style="margin-top: 3rem">
          <h3 class="text-bold">Modal information</h3>
          <ul>
            <n-collapse>
              <n-collapse-item title="Usage" name="1">
                <n-code :code="modalCode" language="javascript" />
              </n-collapse-item>
            </n-collapse>
            <li>
              <span class="text-bold">isVisible</span> : boolean to control the visibility of the
              modal
            </li>
            <li><span class="text-bold">modalTitle</span> : title of the modal</li>
            <li>
              <span class="text-bold">modalType</span> : type of the modal. you can use customize,
              email, password, confirmationModal
              <n-collapse>
                <n-collapse-item title="customize" name="1">
                  <div>
                    <ul>
                      <li>
                        <span class="text-bold">customize</span> is the most flexible type. you can
                        customize the form inputs by form input component and you can give anything
                        structure you want
                      </li>
                    </ul>
                  </div>
                </n-collapse-item>
              </n-collapse>
              <n-collapse>
                <n-collapse-item title="email" name="1">
                  <div>
                    <ul>
                      <li>
                        <span class="text-bold">email</span> : type for any input except password
                        input because password have their own behavior
                      </li>
                    </ul>
                  </div>
                </n-collapse-item>
              </n-collapse>
              <n-collapse>
                <n-collapse-item title="password" name="1">
                  <div>
                    <ul>
                      <li><span class="text-bold">password</span> : type for password input</li>
                    </ul>
                  </div>
                </n-collapse-item>
              </n-collapse>
              <n-collapse>
                <n-collapse-item title="confirmationModal" name="1">
                  <div>
                    <ul>
                      <li>
                        <span class="text-bold">confirmationModal</span> : type for only
                        confirmation modal its only have two button cancel and confirm
                      </li>
                    </ul>
                  </div>
                </n-collapse-item>
              </n-collapse>
            </li>
            <li>
              <span class="text-bold">formInputs</span> : array of form inputs. you can customize
              the form inputs by using the form input component and you can give empty array if you
              want to use confirmation modalType or modalType without form inputs
              <n-collapse>
                <n-collapse-item title="Example" name="1">
                  <n-code :code="formInputsCode" language="javascript" />
                </n-collapse-item>
              </n-collapse>
            </li>
            <li>
              <span class="text-bold">confirmChange</span> : function to handle the confirmation of
              the modal
            </li>
            <li>
              <span class="text-bold">Validation</span> : Each input type has its own validation
              rules. you can add your own validation in the child or inside component modal. for
              example:
              <ul>
                <li>
                  <strong>Name:</strong> Cannot be empty, max length 50, no special characters or
                  numbers.
                </li>
                <li><strong>Phone:</strong> Must be between 9 to 12 digits.</li>
                <li><strong>Password:</strong> Cannot be empty.</li>
                <li><strong>Email:</strong> Must be a valid email format.</li>
                <li>
                  <strong>Company URL:</strong> Must be a valid URL starting with http:// or
                  https://.
                </li>
              </ul>
            </li>
            <li>
              <span class="text-bold">Error Handling</span> : If validation fails, an error message
              will be displayed next to the respective input field.
            </li>
          </ul>
        </div>
      </n-list-item>
      <div style="border-top: 3px solid #e5e5e5; margin-top: 3rem"></div>
      <n-list-item>
        <div style="margin-top: 1.5rem; width: 100%">
          <h2 class="text-bold">SearchBar</h2>
          <SearchBar :queryFn="fetchSearchCompany" :isNavigation="true" />
        </div>
        <div style="margin-top: 3rem">
          <h3 class="text-bold">SearchBar information</h3>
          <ul>
            <n-collapse>
              <n-collapse-item title="Usage" name="1">
                <n-code :code="searchBarCode" language="javascript" />
              </n-collapse-item>
            </n-collapse>
            <li style="margin-top: 1rem">
              <span class="text-bold">queryFn</span> : props the function to fetch data in the
              table. same as DataTable props queryFn
            </li>
            <li>
              <span class="text-bold">isNavigation</span> : boolean to control the behavior of the
              searchBar. if true the searchBar can be used as navigation and if false the searchBar
              will appear follow or unfollow button
            </li>
          </ul>
        </div>
      </n-list-item>
      <div style="border-top: 3px solid #e5e5e5; margin-top: 3rem"></div>

      <n-list-item>
        <div>
          <h2 class="text-bold">Icon</h2>
          <n-icon :component="AcUnitOutlined" size="30" />
        </div>
        <ul>
          <li>
            <span class="text-bold">Icon</span> : Icon is use n-icon component. you can use any icon
            from n-icon
            <n-collapse>
              <n-collapse-item title="Example" name="1">
                <n-code :code="iconCode" language="javascript" />
              </n-collapse-item>
            </n-collapse>
          </li>
        </ul>
      </n-list-item>
      <div style="border-top: 3px solid #e5e5e5; margin-top: 3rem"></div>

      <n-list-item>
        <div>
          <h2 class="text-bold">Tooltips</h2>
          <Tooltips :icon="QuestionCircle20Regular" :icon-size="30">
            <div>
              Credit consumption = Companies Followed * # of Value Triggers you have subscribed to.
              <br />
              <br />
              Please visit our FAQ for more info on Credit consumption.
            </div>
          </Tooltips>
        </div>
        <div style="margin-top: 3rem">
          <h3 class="text-bold">Tooltips information</h3>
          <ul>
            <n-collapse>
              <n-collapse-item title="Usage" name="1">
                <n-code :code="tooltipsCode" language="javascript" />
              </n-collapse-item>
            </n-collapse>
            <li>
              <span class="text-bold">Tooltips</span> : Tooltips is use slot. you can customize the
              content of the tooltips by using slot
            </li>
          </ul>
        </div>
      </n-list-item>
      <div style="border-top: 3px solid #e5e5e5; margin-top: 3rem"></div>
      <n-list-item>
        <div>
          <h2 class="text-bold">Typography</h2>
          <div>
            <div>
              <div class="h1">Heading 1</div>
              <ul>
                <n-collapse>
                  <n-collapse-item title="Usage" name="1">
                    <n-code :code="h1Code" language="javascript" />
                  </n-collapse-item>
                </n-collapse>
              </ul>
            </div>
            <div>
              <div class="h2">Heading 2</div>
              <ul>
                <n-collapse>
                  <n-collapse-item title="Usage" name="1">
                    <n-code :code="h2Code" language="javascript" />
                  </n-collapse-item>
                </n-collapse>
              </ul>
            </div>
            <div>
              <div class="h3">Heading 3</div>
              <ul>
                <n-collapse>
                  <n-collapse-item title="Usage" name="1">
                    <n-code :code="h3Code" language="javascript" />
                  </n-collapse-item>
                </n-collapse>
              </ul>
            </div>
            <div>
              <div class="h4">Heading 4</div>
              <ul>
                <n-collapse>
                  <n-collapse-item title="Usage" name="1">
                    <n-code :code="h4Code" language="javascript" />
                  </n-collapse-item>
                </n-collapse>
              </ul>
            </div>
            <div>
              <div class="text-large">Text Medium</div>
              <ul>
                <n-collapse>
                  <n-collapse-item title="Usage" name="1">
                    <span class="text-bold">info</span> : same as h1 but weight is 400
                    <n-code :code="textMediumCode" language="javascript" />
                  </n-collapse-item>
                </n-collapse>
              </ul>
            </div>
            <div>
              <div class="text-normal">Text Normal</div>
              <ul>
                <n-collapse>
                  <n-collapse-item title="Usage" name="1">
                    <n-code :code="textNormalCode" language="javascript" />
                  </n-collapse-item>
                </n-collapse>
              </ul>
            </div>
            <div>
              <div class="text-semibold">Text Semibold</div>
              <ul>
                <n-collapse>
                  <n-collapse-item title="Usage" name="1">
                    <n-code :code="textSemiboldCode" language="javascript" />
                  </n-collapse-item>
                </n-collapse>
              </ul>
            </div>
            <div>
              <div class="text-small">Text Small</div>
              <ul>
                <n-collapse>
                  <n-collapse-item title="Usage" name="1">
                    <n-code :code="textSmallCode" language="javascript" />
                  </n-collapse-item>
                </n-collapse>
              </ul>
            </div>
            <div>
              <div>Default (same as semibold)</div>
              <ul>
                <n-collapse>
                  <n-collapse-item title="Usage" name="1">
                    <n-code :code="textDefaultCode" language="javascript" />
                  </n-collapse-item>
                </n-collapse>
              </ul>
            </div>
            <div>
              <div class="text-grey">Text Grey</div>
              <ul>
                <n-collapse>
                  <n-collapse-item title="Usage" name="1">
                    <n-code :code="textGreyCode" language="javascript" />
                  </n-collapse-item>
                </n-collapse>
              </ul>
            </div>
            <div>
              <div class="text-primary">Text Primary</div>
              <ul>
                <n-collapse>
                  <n-collapse-item title="Usage" name="1">
                    <n-code :code="textPrimaryCode" language="javascript" />
                  </n-collapse-item>
                </n-collapse>
              </ul>
            </div>
            <div>
              <div class="text-secondary">Text Secondary</div>
              <ul>
                <n-collapse>
                  <n-collapse-item title="Usage" name="1">
                    <n-code :code="textSecondaryCode" language="javascript" />
                  </n-collapse-item>
                </n-collapse>
              </ul>
            </div>
          </div>
        </div>
      </n-list-item>
      <div style="border-top: 3px solid #e5e5e5; margin-top: 3rem"></div>
    </n-list>
  </div>
</template>
<script setup>
import { AcUnitOutlined } from '@vicons/material'

const showModal = ref(false)

const h1Code = `<div class="h1">Heading 1</div>`
const h2Code = `<div class="h2">Heading 2</div>`
const h3Code = `<div class="h3">Heading 3</div>`
const h4Code = `<div class="h4">Heading 4</div>`
const textMediumCode = `<div class="text-medium">Text Medium</div>`
const textNormalCode = `<div class="text-normal">Text Normal</div>`
const textSemiboldCode = `<div class="text-semibold">Text Semibold</div>`
const textSmallCode = `<div class="text-small">Text Small</div>`
const textDefaultCode = `<div>Default (same as semibold)</div>`
const textGreyCode = `<div class="text-grey">Text Grey</div>`
const textPrimaryCode = `<div class="text-primary">Text Primary</div>`
const textSecondaryCode = `<div class="text-secondary">Text Secondary</div>`

const iconCode = `
<n-icon :component="AcUnitOutlined" size="30" />
`

const tooltipsCode = `
<Tooltips :icon="QuestionCircle20Regular" :icon-size="30">
  <div>
    Credit consumption = Companies Followed * # of Value Triggers you have subscribed to.
    <br />
    <br />
    Please visit our FAQ for more info on Credit consumption.
  </div>
</Tooltips>
`

const searchBarCode = `
<SearchBar :queryFn="fetchSearchCompany" :dataTableRef="dataTableRef" />
`

const formInputsCode = `
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
`

const modalCode = `
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
`

const tableCode = `
<DataTable
    ref="dataTableRef"
    :query-fn="queryFn"
    :columns="columns"
    :pagination="false"
    :useCheckbox="true"
    row-key="id"
    @update:selected-rows="handleSelectRows"
/>
`

const queryFnTableCode = `
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
`

const columnsTableCode = `
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
`

const columns = [
  { title: 'ID', key: 'id' },
  { title: 'Name', key: 'name' },
  { title: 'Age', key: 'age' }
]
const queryFn = () => {}
</script>
<style scoped>
.container {
  background-color: white;
  padding: 1.5rem;
}

li:not(:last-child) {
  margin-bottom: 1rem;
}
</style>
