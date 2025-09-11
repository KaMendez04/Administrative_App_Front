import './App.css'
import PrincipalEdition from './pages/editionPage/PrincipalEdition'
import AboutUsEdition from './pages/editionPage/AboutUsEdition'

import AssociatesEdition from './pages/editionPage/AssociatesEdition'
import VolunteersEdition from './pages/editionPage/VolunteersEdition'
import StaffManagementPage from './pages/PersonalPage'
import ServicesEdition from './pages/editionPage/ServicesEdition'
import FAQEdition from './pages/editionPage/FAQ/FAQEdition'
import ManualPage from './pages/ManualPage'
import AssociatesPage from './pages/AssociatesPage'
import VolunteersPage from './pages/VolunteersPage'

function App() {

  return (
    <>
    <PrincipalEdition />
    <AboutUsEdition />
    <ServicesEdition />
    <AssociatesEdition />
    <VolunteersEdition />
    <FAQEdition />
    <StaffManagementPage />
    <ManualPage/>
    <AssociatesPage/>
    <VolunteersPage/>
    </>
  )
}

export default App
