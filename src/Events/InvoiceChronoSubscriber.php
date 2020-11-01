<?php


namespace App\Events;


use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Invoice;
use App\Entity\User;
use App\Repository\InvoiceRepository;
use DateTime;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;

class InvoiceChronoSubscriber implements EventSubscriberInterface
{
    /**
     * @var Security
     */
    private $security;

    /**
     * @var InvoiceRepository
     */
    private $repository;

    /**
     * InvoiceChronoSubscriber constructor.
     * @param Security $security
     * @param InvoiceRepository $repository
     */
    public function __construct(Security $security, InvoiceRepository $repository)
    {
        $this->security = $security;
        $this->repository = $repository;
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['setChronoForInvoice', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setChronoForInvoice(ViewEvent $event)
    {
        $invoice = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();
        /** @var User $user */
        $user = $this->security->getUser();
        if ($invoice instanceof  Invoice && $method === 'POST') {
            $nextChrono = $this->repository->findNextChrono($user);
            $invoice->setChrono($nextChrono);

            if (empty($invoice->getSentAt())) {
                $invoice->setSentAt(new DateTime());
            }
        }
    }
}