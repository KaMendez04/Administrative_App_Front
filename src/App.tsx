import './App.css'
import PrincipalEdition from './pages/editionPage/PrincipalEdition'
import AboutUsEdition from './pages/editionPage/AboutUsEdition'

import AssociatesEdition from './pages/editionPage/AssociatesEdition'
import VolunteersEdition from './pages/editionPage/VolunteersEdition'
import StaffManagementPage from './pages/PersonalPage'
import ServicesEdition from './pages/editionPage/ServicesEdition'
import FAQEdition from './pages/editionPage/FAQ/FAQEdition'
import ManualPage from './pages/ManualPage'
import VolunteersPage from './pages/volunteers/VolunteersSubnav'
import AssociatesApprovedPage from './pages/associates/AssociatesApprovedPage'
import AdminRequestsPage from './pages/associates/AdminRequestPage'

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
    <VolunteersPage/>
    <AssociatesApprovedPage/>
    <AdminRequestsPage/>
    </>
  )
}

export default App
