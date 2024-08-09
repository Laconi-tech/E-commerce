import React from 'react'
import "./Slider.css"; 

import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { Carousel } from 'react-responsive-carousel';
import banner1 from './banniere.avif'
import banner2 from './banner2.avif'

function Slider() {

    // const baseUrl = "https://react-responsive-carousel.js.org/asset/"
    // const Datas = [
    //     {
    //     id:1,
    //     image: '',
    //     title: "Titr du sider 1",
    //     text:'Lorem  '
    // },{
    //     id:2,
    //     image: '${baseUrl}2.jpeg',
    //     title: "Titr du sider 1",
    //     text:'Lorem  '
    // },{
    //     id:3,
    //     image: '${baseUrl}3.jpeg',
    //     title: "Titr du sider 1",
    //     text:'Lorem  '
    // },{
    //     id:4,
    //     image: '$(baseUrl)4.jpeg',
    //     title: "Titr du sider 1",
    //     text:'Lorem  '
    // },

    // ]
  return (
    <Carousel>
        
            <div>
            <img src={require('./banniere.avif')} alt="Image 1" />
            </div>
            <div>
            <img src={require('./banner2.avif')} alt="Image 2" />

            </div>
            <div>
            <img src={require('./banniere.avif')} alt="Image 1" />

            </div>
            <div>
            <img src={require('./banner2.avif')} alt="Image 2" />
            </div>
        
                {/* <div>
                    <img src="assets/1.jpeg" />
                    <p className="legend">Legend 1</p>
                </div>
                <div>
                    <img src="assets/2.jpeg" />
                    <p className="legend">Legend 2</p>
                </div>
                <div>
                    <img src="assets/3.jpeg" />
                    <p className="legend">Legend 3</p>
                </div> */}
            </Carousel>
            
  )
}

export default Slider