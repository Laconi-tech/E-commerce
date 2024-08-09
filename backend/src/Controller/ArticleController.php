<?php


// src/Controller/ArticleController.php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ArticleController
{
    /**
     * @Route("/article", name="article")
     */
    public function index(): Response
    {
        return new Response('Hello');
    }
}
