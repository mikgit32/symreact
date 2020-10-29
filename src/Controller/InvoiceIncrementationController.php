<?php


namespace App\Controller;


use App\Entity\Invoice;
use Doctrine\ORM\EntityManagerInterface;

class InvoiceIncrementationController
{
    public function __invoke(EntityManagerInterface $em, Invoice $data)
    {
        $data->setChrono($data->getChrono() + 1);

        $em->flush();

        return $data;
    }
}