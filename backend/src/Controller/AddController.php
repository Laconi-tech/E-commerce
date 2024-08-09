<?php

namespace App\Controller;

use App\Entity\Article;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;

class AddController extends AbstractController
{
    //#[Route('/add/product', name: 'app_add_product')]
    public function createProduct(EntityManagerInterface $entityManager): Response
    {
        $article = new Article();
        // $article->setCategorie('Keyboard');
        // $article->setPrix(1999);
        // $article->setDescription('Ergonomic and stylish!');
        // $article->setphoto('la photo');
        // $article->setCaracteristiques('los carac');
        // $article->setStock(19);
        // $article->setPhotoUrl('https://m.media-amazon.com/images/I/61OQst6DhtL._AC_SL1000_.jpg');

        // tell Doctrine you want to (eventually) save the Product (no queries yet)
        // $entityManager->persist($article);

        // actually executes the queries (i.e. the INSERT query)
        // $entityManager->flush();

        // return new Response('Saved new product with id '.$article->getId());
        return new Response('method post -----> '. $_POST['prix']);
    }
}
