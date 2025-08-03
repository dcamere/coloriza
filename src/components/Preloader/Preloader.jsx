import React from 'react'
import './Preloader.scss'

export const Preloader = ({ open }) => {
  return <div className={`preloader ${open ? 'preloader--open' : ''}`}></div>
}
