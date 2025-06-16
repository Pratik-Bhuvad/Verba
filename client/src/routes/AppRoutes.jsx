import React from 'react'
import { Routes, Route } from 'react-router-dom'
import routes from './routes'

const AppRoutes = () => {
    return (
        <Routes>
            {
                routes.map((route, i) => {
                   return <Route path={route.path} element={route.component} />
                })
            }
        </Routes>
    )
}

export default AppRoutes
