import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, XCircle, FileText, AlertCircle, Eye } from "lucide-react";

type VerificationStatus = "pending" | "approved" | "rejected";

interface Document {
  id: string;
  type: "license" | "insurance" | "abn" | "id";
  name: string;
  status: VerificationStatus;
  url: string;
  uploadDate: string;
}

interface TradieAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  status: "pending" | "active" | "suspended";
  createdAt: string;
  lastActive: string;
  documents: Document[];
  trade: string;
}

const mockTradieAccounts: TradieAccount[] = [
  {
    id: "1",
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    phone: "0412 345 678",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    status: "pending",
    createdAt: "2023-05-15",
    lastActive: "2023-05-15",
    trade: "Electrician",
    documents: [
      {
        id: "doc1",
        type: "license",
        name: "Electrical License",
        status: "pending",
        url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80",
        uploadDate: "2023-05-15",
      },
      {
        id: "doc2",
        type: "insurance",
        name: "Public Liability Insurance",
        status: "pending",
        url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80",
        uploadDate: "2023-05-15",
      },
      {
        id: "doc3",
        type: "abn",
        name: "ABN Certificate",
        status: "pending",
        url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80",
        uploadDate: "2023-05-15",
      },
    ],
  },
  {
    id: "2",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    phone: "0423 456 789",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    status: "pending",
    createdAt: "2023-05-14",
    lastActive: "2023-05-14",
    trade: "Plumber",
    documents: [
      {
        id: "doc4",
        type: "license",
        name: "Plumbing License",
        status: "pending",
        url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80",
        uploadDate: "2023-05-14",
      },
      {
        id: "doc5",
        type: "insurance",
        name: "Public Liability Insurance",
        status: "pending",
        url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80",
        uploadDate: "2023-05-14",
      },
    ],
  },
  {
    id: "3",
    name: "David Chen",
    email: "david.chen@example.com",
    phone: "0434 567 890",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    status: "active",
    createdAt: "2023-05-10",
    lastActive: "2023-05-15",
    trade: "Carpenter",
    documents: [
      {
        id: "doc6",
        type: "license",
        name: "Carpentry License",
        status: "approved",
        url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80",
        uploadDate: "2023-05-10",
      },
      {
        id: "doc7",
        type: "insurance",
        name: "Public Liability Insurance",
        status: "approved",
        url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80",
        uploadDate: "2023-05-10",
      },
      {
        id: "doc8",
        type: "abn",
        name: "ABN Certificate",
        status: "approved",
        url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80",
        uploadDate: "2023-05-10",
      },
    ],
  },
];

const TradieAccountManagement = () => {
  const [selectedTradie, setSelectedTradie] = useState<TradieAccount | null>(
    null,
  );
  const [viewingDocument, setViewingDocument] = useState<Document | null>(null);
  const [filter, setFilter] = useState<
    "all" | "pending" | "active" | "suspended"
  >("all");

  const filteredAccounts = mockTradieAccounts.filter(
    (account) => filter === "all" || account.status === filter,
  );

  const handleViewDocument = (document: Document) => {
    setViewingDocument(document);
  };

  const handleCloseDocumentView = () => {
    setViewingDocument(null);
  };

  const handleApproveDocument = (documentId: string) => {
    // In a real app, this would update the document status in the database
    console.log(`Approving document ${documentId}`);

    // For demo purposes, we'll just close the document view
    setViewingDocument(null);
  };

  const handleRejectDocument = (documentId: string) => {
    // In a real app, this would update the document status in the database
    console.log(`Rejecting document ${documentId}`);

    // For demo purposes, we'll just close the document view
    setViewingDocument(null);
  };

  const handleApproveAccount = (tradieId: string) => {
    // In a real app, this would update the tradie account status in the database
    console.log(`Approving tradie account ${tradieId}`);
  };

  const handleSuspendAccount = (tradieId: string) => {
    // In a real app, this would update the tradie account status in the database
    console.log(`Suspending tradie account ${tradieId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tradie Account Management</h2>
        <div className="flex space-x-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            onClick={() => setFilter("pending")}
          >
            Pending
          </Button>
          <Button
            variant={filter === "active" ? "default" : "outline"}
            onClick={() => setFilter("active")}
          >
            Active
          </Button>
          <Button
            variant={filter === "suspended" ? "default" : "outline"}
            onClick={() => setFilter("suspended")}
          >
            Suspended
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredAccounts.map((tradie) => (
          <Card key={tradie.id} className="bg-white">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={tradie.avatar} alt={tradie.name} />
                    <AvatarFallback>
                      {tradie.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{tradie.name}</CardTitle>
                    <CardDescription>{tradie.trade}</CardDescription>
                  </div>
                </div>
                <Badge
                  variant={
                    tradie.status === "active"
                      ? "default"
                      : tradie.status === "pending"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {tradie.status.charAt(0).toUpperCase() +
                    tradie.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p>{tradie.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p>{tradie.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p>{tradie.createdAt}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Active</p>
                  <p>{tradie.lastActive}</p>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium mb-2">Verification Documents</h4>
                <div className="border rounded-md">
                  {tradie.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex justify-between items-center p-3 border-b last:border-b-0"
                    >
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Uploaded: {doc.uploadDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            doc.status === "approved"
                              ? "default"
                              : doc.status === "rejected"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {doc.status.charAt(0).toUpperCase() +
                            doc.status.slice(1)}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDocument(doc)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                {tradie.status === "pending" && (
                  <Button onClick={() => handleApproveAccount(tradie.id)}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Account
                  </Button>
                )}
                {tradie.status !== "suspended" && (
                  <Button
                    variant="destructive"
                    onClick={() => handleSuspendAccount(tradie.id)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Suspend Account
                  </Button>
                )}
                {tradie.status === "suspended" && (
                  <Button onClick={() => handleApproveAccount(tradie.id)}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Reactivate Account
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Document Preview Modal */}
      {viewingDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{viewingDocument.name}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseDocumentView}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-4">
              <div className="aspect-[3/4] bg-gray-100 rounded-md overflow-hidden mb-4">
                <img
                  src={viewingDocument.url}
                  alt={viewingDocument.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="destructive"
                  onClick={() => handleRejectDocument(viewingDocument.id)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Document
                </Button>
                <Button
                  onClick={() => handleApproveDocument(viewingDocument.id)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Document
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradieAccountManagement;
