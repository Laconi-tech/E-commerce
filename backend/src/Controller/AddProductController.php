<?php

namespace App\Controller;

use App\Entity\Article;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;

class AddProductController extends AbstractController
{
    //#[Route('/add/product', name: 'app_add_product')]
    public function createProduct(EntityManagerInterface $entityManager): Response
    {
        $article = new Article();
        $article->setIdCategorie($_POST['categorie']);
        $article->setPrix($_POST['prix']);
        $article->setDescription($_POST['description']);
        $article->setphoto($_POST['photo']);
        $article->setCaracteristiques($_POST['caracteristiques']);
        $article->setStock($_POST['stock']);
        $article->setPhotoUrl($_POST['photo_url']);
        $article->setPoids($_POST['poids']);
        $article->setDateAdd(new \Datetime());
        $article->setConsultation(0);
        $article->setRabaisPct(0);
// 'https://m.media-amazon.com/images/I/61OQst6DhtL._AC_SL1000_.jpg'
        // tell Doctrine you want to (eventually) save the Product (no queries yet)
        $entityManager->persist($article);

        // actually executes the queries (i.e. the INSERT query)
        $entityManager->flush();

        return new Response('Saved new product with id '.$article->getId());
        // return new Response('method post -----> '. $_POST['prix']);
    }
}
