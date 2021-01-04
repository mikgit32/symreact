import React, { useEffect, useState } from 'react';
import Pagination from "../components/Pagination";

import CustomersAPI from "../services/customersAPI";

const CustomersPage = props => {

    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');

    // Permet d'aller récupérer les customers
    const fetchCustomers = async () => {
        try {
            const data =  await CustomersAPI.findAll();
            setCustomers(data);
        } catch (error) {
            console.log(error.response);
        }
    }

    // Au chargement du composant, on va chercher les customers
    useEffect(() => {
        fetchCustomers();
        // CustomersAPI.findAll()
        //     .then(data => setCustomers(data))
        //     .catch(error => console.log(error.response));
    }, [])

    // Gestion de la suppression d'un customer
    const handleDelete = async id => {
        // console.log(id);

        const originalCustomers = [...customers];

        // 1. L'approche optimiste
        setCustomers(customers.filter(customer => customer.id !== id));

        // 2. L'approche pessimiste
        try {
            await CustomersAPI.delete(id);
        } catch(error) {
            setCustomers(originalCustomers);
        }
        // Deuxième façon de faire une requête (traitement de promesse)
        // CustomersAPI.delete(id)
        //     .then(response => console.log("ok"))
        //     .catch(error => {
        //         setCustomers(originalCustomers);
        //         console.log(error.response);
        //     });
    }

    // Gestion du changement de la page
    const handlePageChange = (page) => setCurrentPage(page);

    // Gestion de la recherche
    // const handleSearch = event => {
    //     const value = event.currentTarget.value;
    //     setSearch(value);
    //     setCurrentPage(1);
    // }
    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    }

    const itemsPerPage = 10;

    // Filtrage des customers en fonction de la recherche
    const filteredCustomers = customers.filter(c =>
        c.firstName.toLowerCase().includes(search.toLowerCase()) ||
        c.lastName.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
    );

    // console.log(pagesCount);
    // console.log(pages);

    // d'où on part (start) pendant combien (itemsPerPage)
    // const start = currentPage * itemsPerPage - itemsPerPage;
    // const paginatedCustomers = customers.slice(start, start + itemsPerPage);

    // const paginatedCustomers =
    //     filteredCustomers.length > itemsPerPage
    //         ? Pagination.getData(filteredCustomers, currentPage, itemsPerPage)
    //         : filteredCustomers;

    // Pagination des données
    const paginatedCustomers = Pagination.getData(filteredCustomers, currentPage, itemsPerPage);

    return (

        <>
            <h1>Liste des clients</h1>

            <div className="form-group">
                <input
                    type="text"
                    className="form-control"
                    onChange={handleSearch}
                    value={search}
                    placeholder="Rechercher..."
                />
            </div>

            <table className="table table-hover">
                <thead>
                <tr>
                    <th>Id.</th>
                    <th>Client</th>
                    <th>Email</th>
                    <th>Entrprise</th>
                    <th className="text-center">Factures</th>
                    <th className="text-center">Montant total</th>
                    <th/>
                </tr>
                </thead>

                <tbody>
                {paginatedCustomers.map(customer => (
                    <tr key={customer.id}>
                        <td>{customer.id}</td>
                        <td>
                            <a href="#">{customer.firstName} {customer.lastName}</a>
                        </td>
                        <td>{customer.email}</td>
                        <td>{customer.company}</td>
                        <td className="text-center">
                            <span className="badge badge-primary">{customer.invoices.length}</span>
                        </td>
                        <td className="text-center">{customer.totalAmount
                            .toLocaleString()} €</td>
                        <td>
                            <button
                                onClick={() => handleDelete(customer.id)}
                                disabled={customer.invoices.length > 0}
                                className="btn btn-sm btn-danger">
                                Supprimer
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {itemsPerPage < filteredCustomers.length && (
                <Pagination
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    length={filteredCustomers.length}
                    onPageChanged={handlePageChange}
                />
            )}
        </>
    );
}

export default CustomersPage;