import React , { useEffect, useState } from 'react';
import { get  } from 'lodash';

import { TextStyle, EmptyState, Layout, Page, Card, DataTable} from '@shopify/polaris';
import { ResourcePicker, TitleBar } from '@shopify/app-bridge-react';
import store from 'store-js';
//import ResourceListWithProducts from '../components/ResourceList';
import axios from "axios";

const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';
const defaultRows = [
  ['Hari', 'hkolli@ftdi.com', 'Hyderabad', 4, '$500.00'],
  ['Cherith', 'cherith@mangocrab.com', 'Gudivada', 1, '$39.00']
];

const Index = ( props ) => {
  const [loading, setLoading ] = useState(false);
  const [rows, setRows ] = useState(defaultRows);
  
  console.log(props);

  return (
    <div className='harinath' style={{paddingTop: '10px'}}>
    

     
        <Page style={{margin: '10px'}}>
         
          <Layout style={{margin: '10px'}}>
            <Card title="Customer dashboard" sectioned style={{margin: '10px'}}>
            <DataTable
                columnContentTypes={[
                  'text',
                  'text',
                  'text',
                  'numeric',
                  'numeric',
                ]}
                headings={[
                  'Full Name',
                  'Email',
                  'City',
                  'Orders',
                  'Total Spent',
                ]}
                rows={props.customers || rows}
              /> 
            
            </Card>

          </Layout>
      
        </Page>
        {/* <Page
          title="Page Title"
          breadcrumbs={[{ content: 'Settimgs', url: '/annotated-layout'}]}
        >
          <Layout>
            <EmptyState
              heading="Empty State Heading"
              action={{
                content: 'Select products',
                onAction: () => console.log('clicked'),
                onMouseEnter: () => console.log('clicked')
              }}
              image={img}
            >
              <p>Select Productsto change their price temporarirly hari</p>
            </EmptyState>
          </Layout>
          
        </Page> */}
    </div> 
    
    
    
  );
}

Index.getInitialProps = async (ctx) => {
  console.log('get initial props');
  const res = {} ;//await axios.get('https://fb582b046ed1.ngrok.io/api/customers')
  //const json = await res.json();
  console.log('---------------');
  const customers = get(res,'data.customers', []);
  console.log(customers);

  const normalizedData = customers.map( customer => {
    return [
      customer.first_name,
      customer.email,
      customer.addresses[0].city,
      customer.orders_count,
      customer.total_spent
    ];
  });
  console.log('normalizedData');

  console.log(normalizedData);
  return { customers: normalizedData }
}

export default Index;