<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Repository\OperationRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: OperationRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(
            normalizationContext: ['groups' => ['read:Operation:collection']]
        ),
        new Get(
            normalizationContext: ['groups' => ['read:Operation:collection', 'read:Operation:item']]
        ),
        new Post(
            denormalizationContext: ['groups' => ['put:Operation']]
        ),
        new Put(
            denormalizationContext: ['groups' => ['put:Operation']]
        ),
        new Patch(
            denormalizationContext: ['groups' => ['put:Operation']]
        ),
        new Delete(),
    ],
    normalizationContext: ['groups' => ['read:Operation:collection']],
)]
class Operation
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['read:Operation:collection'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['read:Operation:collection', 'put:Operation'])]
    private ?string $label = null;

    #[ORM\Column]
    #[Groups(['read:Operation:collection', 'put:Operation'])]
    private ?float $amount = null;

    #[ORM\Column]
    #[Groups(['read:Operation:collection'])]
    private ?\DateTimeImmutable $date = null;

    #[ORM\ManyToOne(cascade: ['persist'], inversedBy: 'operations')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['read:Operation:collection', 'put:Operation'])]
    private ?Category $category = null;

    public function __construct()
    {
        $this->date = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLabel(): ?string
    {
        return $this->label;
    }

    public function setLabel(string $label): static
    {
        $this->label = $label;

        return $this;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount(float $amount): static
    {
        $this->amount = $amount;

        return $this;
    }

    public function getDate(): ?\DateTimeImmutable
    {
        return $this->date;
    }

    public function setDate(\DateTimeImmutable $date): static
    {
        $this->date = $date;

        return $this;
    }

    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function setCategory(?Category $category): static
    {
        $this->category = $category;

        return $this;
    }
}
